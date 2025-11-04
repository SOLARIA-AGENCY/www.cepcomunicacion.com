# SSH Configuration - SOLARIA Hetzner Access

## SSH Key Location
- **Private Key**: `~/.ssh/solaria-hetzner/id_solaria_hetzner_prod`
- **Public Key**: `~/.ssh/solaria-hetzner/id_solaria_hetzner_prod.pub`
- **Known Hosts**: `~/.ssh/solaria-hetzner/known_hosts`

## Server Connection
```bash
ssh -i ~/.ssh/solaria-hetzner/id_solaria_hetzner_prod root@46.62.222.138
```

## SSH Config Entry
Add to `~/.ssh/config`:
```
Host hetzner-cep
    HostName 46.62.222.138
    User root
    IdentityFile ~/.ssh/solaria-hetzner/id_solaria_hetzner_prod
    IdentitiesOnly yes
    StrictHostKeyChecking accept-new
```

## Quick Connect
```bash
ssh hetzner-cep
```

## SCP/RSYNC Examples
```bash
# Copy file to server
scp -i ~/.ssh/solaria-hetzner/id_solaria_hetzner_prod file.txt root@46.62.222.138:/var/www/

# Sync directory
rsync -avz -e "ssh -i ~/.ssh/solaria-hetzner/id_solaria_hetzner_prod" \
  ./local/ root@46.62.222.138:/var/www/remote/
```

## Key Fingerprint
```
SHA256:AMdmaVhw/6byPohYVugI0TJjsQw531eEYjqS9a+hsPw
```

## Last Updated
2025-11-04
