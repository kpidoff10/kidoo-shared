# Architecture MQTT - Kidoo

## Vue d'ensemble

Le système Kidoo utilise **MQTT** pour la communication en temps réel entre:
- **App React Native** (utilisateurs)
- **Devices ESP32** (Kidoos)
- **Serveur Vercel** (orchestration)

### Broker MQTT
- **Type:** EMQX 5.0.0
- **Déploiement:** Docker
- **Ports:**
  - `1883` - MQTT natif (ESP32, Server)
  - `9001` - WebSocket (App React Native)
  - `18083` - Dashboard d'administration

---

## Authentication

### Par type de client

#### 1. **App (React Native)**
```
Username: {userId}  (UUID format)
Example: ccc16959-e2bd-4640-b5cd-99e6bb4c04b3

Password: JWT signé
Format: {header}.{payload}.{signature}
Contient: userId, type:"mqtt", exp: timestamp
Expiration: 1 heure
```

**Flux:**
```
App → GET /api/mqtt-token
Server → retourne (username, password JWT)
App → se connecte à EMQX avec JWT
EMQX → appelle /api/mqtt/auth pour valider JWT
```

#### 2. **ESP32 Device**
```
Username: {MAC_ADDRESS}  (12 hex chars)
Example: 80B54ED96148

Password: MQTT_PASSWORD (statique)
Défini dans .env du serveur
```

**Flux:**
```
ESP32 → GET /api/devices/{mac}/mqtt-token (avec signature Ed25519)
Server → retourne (username=MAC, password)
ESP32 → se connecte à MQTT avec MAC + password
EMQX → appelle /api/mqtt/auth pour valider
```

#### 3. **Server (Vercel Serverless)**
**Note:** Le serveur Vercel est serverless et ne maintient pas de connexion MQTT persistante.
L'app publie les commandes MQTT directement sans passer par le serveur.

**Endpoints stateless:**
- `GET /api/mqtt-token` - Fournit credentials JWT à l'app
- `POST /api/mqtt/auth` - EMQX appelle ça pour valider les credentials
- `POST /api/mqtt/acl` - EMQX appelle ça pour vérifier les permissions
- `POST /api/kidoos/{id}/device-info` - App envoie les infos reçues via MQTT pour mettre à jour la DB

---

## Topics et Payloads

### Topic Telemetry (Device → App/Server)
**Topic:** `kidoo/{MAC_ADDRESS}/telemetry`

**Payload - Status (heartbeat toutes les 60s):**
```json
{
  "status": "online|offline",
  "device": "Kidoo",
  "timestamp": 1234567890
}
```

**Payload - Info Response:**
```json
{
  "type": "info",
  "device": "Kidoo Sound",
  "mac": "80:B5:4E:D9:61:48",
  "model": "sound",
  "firmwareVersion": "1.0.0",
  "brightness": 100,
  "storage": {
    "total": 7811989504,
    "used": 4849664,
    "free": 7807139840
  }
}
```

**Payload - Environment Response:**
```json
{
  "type": "env",
  "temperatureC": 22.5,
  "humidityPercent": 45,
  "pressurePa": 101325
}
```

### Topic Commands (Server → Device)
**Topic:** `kidoo/{MAC_ADDRESS}/cmd`

**Payload - Get Info:**
```json
{
  "cmd": "get-info"
}
```

**Payload - Get Environment:**
```json
{
  "cmd": "get-env"
}
```

**Payload - Set Timezone:**
```json
{
  "cmd": "set-timezone",
  "timezoneId": "Europe/Paris"
}
```

**Payload - Firmware Update:**
```json
{
  "cmd": "firmware-update",
  "version": "1.0.1",
  "url": "https://..."
}
```

---

## Keep-Alive (Heartbeat)

### Mécanisme
- **Intervalle:** 60 secondes
- **Implémentation:** MQTT keep-alive natif
- **Comportement:** Si client ne répond pas → reconnexion auto

### Timeline
```
T=0s   : Client connecté
T=60s  : Keep-alive ping → PONG
T=120s : Keep-alive ping → PONG
T=180s : Keep-alive ping → TIMEOUT → reconnexion
```

### Détection Offline
Si App ne reçoit pas de message pendant **5 minutes** → mark device as offline

---

## ACLs (Access Control Lists)

### Permissions par type de client

#### App (userId)
```
ALLOW:
  - Subscribe: kidoo/+/telemetry (tous les topics de ses devices)

DENY:
  - Publish: * (app ne publie que via HTTP au serveur)
```

#### ESP32 (MAC_ADDRESS)
```
ALLOW:
  - Publish: kidoo/{MAC}/telemetry (son topic uniquement)
  - Subscribe: kidoo/{MAC}/cmd (ses commandes)

DENY:
  - Accès à topics d'autres devices
```

#### Server
```
ALLOW:
  - Publish: kidoo/+/cmd (envoyer commandes)
  - Subscribe: kidoo/+/telemetry (recevoir réponses)

DENY:
  - Rien (accès complet)
```

---

## Flux - Exemple: Get Info (Architecture Serverless)

### Étape 1: App publie commande MQTT directement
```
App → MQTT Publish kidoo/80B54ED96148/cmd
Payload: {"action": "get-info"}
(Pas de requête HTTP - direct au broker)
```

### Étape 2: Device reçoit et répond
```
ESP32 reçoit sur topic kidoo/80B54ED96148/cmd
Lit la commande "get-info"
Exécute et collecte les infos
```

### Étape 3: Device publie réponse
```
ESP32 → MQTT Publish kidoo/80B54ED96148/telemetry
Payload: {
  "type": "info",
  "device": "Kidoo Sound",
  "model": "sound",
  "firmwareVersion": "1.0.0",
  "storage": { "total": 8000000000, "free": 6000000000, "used": 2000000000 }
}
```

### Étape 4: App reçoit la réponse via MQTT
```
App abonné à kidoo/80B54ED96148/telemetry
Reçoit le message "type": "info"
Récupère les infos (firmware, storage)
```

### Étape 5: App met à jour la DB (optionnel)
```
App → HTTP POST /api/kidoos/{id}/device-info
Body: { firmwareVersion: "1.0.0", storage: {...} }
Serveur met à jour la DB pour historique
```

### Étape 6: App met à jour UI
```
App affiche les infos reçues
Device marque comme "EN LIGNE" ✅
```

---

## Debugging

### Dashboard EMQX
**URL:** http://{ip}:18083
- **Connections:** Voir qui est connecté
- **Topics:** Voir les topics actifs
- **Messages:** Voir les messages publiés en temps réel

### Logs

#### Server
```bash
grep "[MQTT-TOKEN]" /var/log/app.log
grep "[MQTT-AUTH]" /var/log/app.log
```

#### App
```
LOG [MQTT-TOKEN] - Token request/response
LOG [MQTT] - Connection status
LOG [KIDOOS-REALTIME] - Message reception
```

#### EMQX
```bash
docker logs kidoo-emqx | grep -i "auth\|connection\|subscribe"
```

### Problèmes courants

#### "Client offline"
- ✅ Vérifier que EMQX écoute sur le bon port
- ✅ Vérifier les ACLs (auth endpoint retourne true?)
- ✅ Vérifier la connectivité réseau

#### "Connection refused"
- ✅ EMQX tourne? `docker ps | grep emqx`
- ✅ Port correct? (1883 pour TCP, 9001 pour WebSocket)
- ✅ Firewall ouvert?

#### "JWT expired"
- ✅ App doit appeler `/api/mqtt-token` pour nouveau JWT
- ✅ TTL: 1 heure
- ✅ Re-connexion auto renouvelle le token

---

## Configuration Environnement

### Server (.env)
```bash
MQTT_BROKER_URL=mqtt://mqtt.kidoo-box.com:1883
MQTT_BROKER_URL_CLIENT=ws://mqtt.kidoo-box.com:9001
MQTT_PASSWORD=...
MQTT_JWT_SECRET=...
```

### ESP32 (hardcodé + fetch)
```cpp
DEFAULT_MQTT_BROKER_HOST = "mqtt.kidoo-box.com"
DEFAULT_MQTT_BROKER_PORT = 1883
// Puis fetch credentials avec signature Ed25519
```

### App (.env)
```bash
EXPO_PUBLIC_MQTT_URL=ws://mqtt.kidoo-box.com:9001
// Les credentials sont fetchés dynamiquement
```

---

## Optimisations Implémentées

### ✅ MQTT Direct pour Commandes (Mars 2026)
- App publie directement sur `kidoo/{MAC}/cmd` (sans passer par serveur HTTP)
- ACLs configurées pour autoriser app à publish/subscribe sur ses topics
- Réduit la latence et la charge serveur
- Architecture serverless compatible (Vercel)

## Évolution Future

### Optimisations possibles
1. **Compression des payloads**
   - MessagePack au lieu de JSON
   - Pour les devices bas débit

3. **Clustering EMQX**
   - Haute disponibilité
   - Load balancing

4. **Authentification par certificat (mTLS)**
   - Au lieu de username/password
   - Plus sécurisé pour prod

---

## Références

- [EMQX Documentation](https://www.emqx.io/docs)
- [MQTT Specification](https://mqtt.org/)
- [mqtt.js (client JavaScript)](https://github.com/mqttjs/MQTT.js)

