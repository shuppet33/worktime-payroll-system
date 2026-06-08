# Frontend Utils and Layers

Документ фиксирует текущие утилиты проекта и правила слоев для `client/src`.

## Layers

### `pages`

Роуты и сборка экрана. Page может:

- подключать feature-компоненты;
- работать с роутером (`Navigate`, `useNavigate`, `useParams`);
- собирать layout и shared UI;
- принимать решение, какие фичи показать.

Page не должен хранить бизнес-логику, API-запросы, `reatomResource`, маппинг DTO или сложные преобразования.

### `features`

Фичи содержат законченные части интерфейса: модалки, таблицы, карточки, формы. Здесь живут:

- `.view.tsx` компоненты;
- `.reatom.ts` atoms/actions/resources для фичи;
- `.service.ts` запросы/async/resource-логика фичи;
- `.types.ts` типы фичи;
- `.constants.ts` константы;
- `.utils.ts` чистые функции фичи.

Page-local фичи допустимы: если модалка используется только на одной странице, она все равно может жить в `features/<domain>/<feature>`, но не обязана иметь внешний props API.

### `entities`

Глобальные сущности приложения. Сейчас здесь лежат:

- `auth.ts` - текущий пользователь и токен;
- `employee` - моковые сотрудники и тип сотрудника;
- `work-day` - типы и моковые рабочие дни.

Entities подходят для данных, которые живут дольше одной страницы или влияют на несколько фич.

### `shared`

Инфраструктура без доменной бизнес-логики:

- `shared/api/url.ts` - адрес API;
- `shared/auth/auth.ts` - auth HTTP-запросы;
- `shared/companies/companies.ts` - company HTTP-запросы;
- `shared/context.ts` - Reatom context;
- `shared/theme.ts` - тема приложения;
- `shared/styles` - общие styled primitives.

### `widgets`

Крупные layout-блоки, например `Header` и `Footer`.

## Utilities

### `generateCalendarDays`

Файл: `client/src/features/employee/employee-calendar/generate-calendar-days.utils.ts`

Возвращает массив дней календаря для месяца и года. Пустые ячейки перед первым днем месяца представлены как `null`.

Используется в `EmployeeCalendar`.

### `getInviteUserInitials`

Файл: `client/src/features/company/company-invite-modal/company-invite-modal.utils.ts`

Возвращает инициалы пользователя для аватара. Если имя состоит из нескольких слов, берет первые буквы первых двух слов. Иначе берет первые два символа строки.

### `getFilteredInviteUsers`

Файл: `client/src/features/company/company-invite-modal/company-invite-modal.utils.ts`

Фильтрует пользователей для invite-модалки по имени, логину и email.

### `getFilteredInvitedUsers`

Файл: `client/src/features/company/company-settings-modal/access-section.utils.ts`

Фильтрует уже приглашенных пользователей в access-секции по имени, логину и роли.

## API Services

### Auth

Файл: `client/src/shared/auth/auth.ts`

- `checkLoginRequest` - проверяет доступность логина.
- `registerRequest` - регистрация.
- `loginRequest` - авторизация.
- `meRequest` - получение текущего пользователя.
- `logoutRequest` - выход.

Типы лежат рядом: `client/src/shared/auth/auth.types.ts`.

### Companies

Файл: `client/src/shared/companies/companies.ts`

- `createCompanyRequest` - создание компании.
- `joinCompanyRequest` - вход по invite-ссылке.
- `updateCompanyRequest` - обновление компании.
- `deleteCompanyRequest` - удаление компании.
- `getCompanyMembersRequest` - получение сотрудников компании.

Типы лежат рядом: `client/src/shared/companies/companies.types.ts`.

### Company Feature Service

Файл: `client/src/features/company/company.service.ts`

- `membersResource` - загружает сотрудников выбранной компании.
- `inviteUsersResource` - ищет пользователей для invite-модалки.
- `updateNameAsync` - обновляет название компании.
- `deleteAsync` - удаляет компанию и закрывает связанные модалки.

Типы лежат рядом: `client/src/features/company/company.types.ts`.

## File Naming

- React UI: `.view.tsx`
- Reatom model: `.reatom.ts`
- Types: `.types.ts`
- Constants: `.constants.ts`
- Utils: `.utils.ts`
- Services: `.service.ts`
- Hooks: `.hook.ts`

`index.ts` используется только как public API и экспортирует только то, что реально импортируется снаружи.

## Component Rules

- Ориентир по размеру view: до 150 строк, допустимо 150-180 строк.
- Типы не объявляются внутри view/service, а выносятся в `.types.ts`.
- Константы выносятся в `.constants.ts`.
- Чистые функции выносятся в `.utils.ts`.
- Обработчики в JSX выносятся в `handle...`, если занимают больше одной короткой строки.
- Флаги называются с префиксом `is`, `has`, `can`, `should`.
- Обработчики событий называются с префиксом `handle`.
