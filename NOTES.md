# Notes d'intégration — modules team / users / gateway-token

## Hypothèses prises (à vérifier contre ton schéma réel)
- Le modèle `User` a bien des champs `firstName`, `lastName`, `password`,
  `deletedAt` (comme dans ton `UsersService` existant), et une relation
  `team` (`team: { connect: { id } }`).
- Le modèle `Team` a un champ `slug` unique (généré ici "à la main", sans le
  package `slugify` utilisé côté Config Service — remplace `slugify()` par
  le vrai package si déjà en dépendance).
- `PrismaService` et `JwtService` sont fournis **globalement** (sinon
  décommenter l'import de `PrismaModule` dans chaque `*.module.ts`).
- Le modèle `Session` que tu as ajouté est exposé par Prisma sous
  `this.prisma.session`.

## Le contrat `AuthContext`
Tous les DTO de routes protégées (JWT) portent un champ `requester:
AuthContext` (`{ sub, teamId, role }`). C'est le service en amont (gateway /
forwarding, ou un guard côté NestJS si tu exposes ces patterns derrière une
couche HTTP) qui décode le JWT et remplit ce champ avant d'émettre le
message — jamais le client final. Aucun guard n'est inclus ici puisque les
`@MessagePattern` ne passent pas par les Guards HTTP classiques.

## Règles métier appliquées
- `team.register` : public, crée Team + User(role=CREATOR) en transaction,
  puis ouvre une session (JWT signé + ligne `Session` en DB avec
  accessToken/refreshToken). Le refreshToken est un simple hex aléatoire
  (32 bytes) — pas de rotation implémentée ici.
- `team.delete` : réservé au CREATOR de la team du requester. Pas de
  paramètre `teamId` côté DTO : on supprime toujours **la team du
  requester**, jamais une team arbitraire (cohérent avec la route
  documentée `DELETE /auth/team`, sans `:id`).
- `users.create` : réservé au CREATOR. Le rôle `CREATOR` est explicitement
  rejeté (un seul CREATOR par team, fixé via `team.register`).
- `users.delete` : réservé au CREATOR, soft-delete (`deletedAt`), impossible
  de supprimer le CREATOR lui-même.
- `gateway-token.*` : scopé à la team du requester. Le token créé suit le
  format `gw_<48 hex>` pour rester cohérent avec l'exemple `GATEWAY_TOKEN=
  gw_xxxxx` de la doc.

## Endpoints "bonus" ajoutés (hors doc d'origine)
- `users.findAll`, `users.findOne`, `gateway-token.findAll` (celui-ci est
  documenté, les deux premiers non) : ajoutés parce qu'un gateway aura
  presque toujours besoin de lister/lire en plus de créer/supprimer. Retire
  les patterns correspondants dans les `*.constants.ts` si tu ne veux pas
  les exposer pour l'instant.

## Hors scope (volontairement non traité ici)
- `login`, `logout`, `otp/send`, `otp/verify` restent dans `AppService` /
  `AppController` existants. Il faudra à terme les faire migrer vers le
  modèle `Session` (au lieu du JTI Redis documenté) pour rester cohérent
  avec ce que `team.register` fait déjà ici — login devra créer une
  `Session`, logout devra passer `loggedOut = true` (ou supprimer la ligne).
