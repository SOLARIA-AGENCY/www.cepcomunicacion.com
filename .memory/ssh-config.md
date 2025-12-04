# SSH Configuration - CEPComunicación Production

## SSH Key Location
- **Private Key**: `~/.ssh/cepcomunicacion`
- **Public Key**: `~/.ssh/cepcomunicacion.pub`
- **Key Name in Hetzner**: `cepcomunicacion-prod-key`

## Key Fingerprint
```
MD5:50:87:92:8c:86:3a:c5:92:e9:e6:92:ec:46:99:52:d1
```

## Server Connection
```bash
ssh -i ~/.ssh/cepcomunicacion root@46.62.222.138
```

## SSH Config Entry
Add to `~/.ssh/config`:
```
Host cep-prod
    HostName 46.62.222.138
    User root
    IdentityFile ~/.ssh/cepcomunicacion
    IdentitiesOnly yes
    StrictHostKeyChecking accept-new
```

## Quick Connect
```bash
ssh cep-prod
```

## SCP/RSYNC Examples
```bash
# Copy file to server
scp -i ~/.ssh/cepcomunicacion file.txt root@46.62.222.138:/var/www/

# Sync directory
rsync -avz -e "ssh -i ~/.ssh/cepcomunicacion" \
  ./local/ root@46.62.222.138:/var/www/remote/
```

## Server Host Key Fingerprint
```
SHA256:XwmyM1sPXPxfjlS4NhIZQUfvtuZCrf0vg3wVV4nnZ9A (ED25519)
```

## Last Updated
2025-12-04
