# LLM Project Structure Guide

Этот документ нужен для LLM-агентов, которые меняют код проекта. Следуй ему как обязательному набору правил перед созданием, переносом или рефакторингом файлов.

## Главный принцип

Проект использует плоскую архитектуру с минимальной вложенностью. Файл должен называться так, чтобы его роль была понятна без открытия.

Не создавай папки `ui`, `model`, `lib` заранее. Если в модуле до 5 файлов, файлы лежат рядом. Подпапки допустимы только когда файлов стало больше 5 и без группировки модуль плохо читается.

## Слои

### `pages`

`pages` отвечает за route-level сборку экрана.

Можно:

- подключать feature-компоненты;
- работать с `react-router`;
- собирать layout;
- показывать/скрывать фичи по состоянию route;
- рендерить простые shared UI-компоненты.

Нельзя:

- делать API-запросы;
- создавать `reatomResource`;
- хранить бизнес-логику;
- делать DTO/domain маппинг;
- складывать всю логику модалок в page model.

Если состояние относится только к конкретной модалке или фиче, оно должно жить рядом с этой фичей в `.reatom.ts`.

### `features`

`features` содержит атомарные части интерфейса: модалки, таблицы, карточки, формы, календари.

Фича может быть page-local, даже если используется только на одном route. Это нормально.

Фича может содержать:

- `.view.tsx` - React UI;
- `.reatom.ts` - atoms/actions/resources;
- `.service.ts` - запросы, async, resource-логика;
- `.types.ts` - типы;
- `.constants.ts` - константы;
- `.utils.ts` - чистые функции.

Если модалка используется только внутри одной страницы, не создавай большой props API. Пусть модалка читает свою модель напрямую через atoms/resources. Props нужны только если данные действительно удобнее или безопаснее передать сверху.

### `entities`

`entities` хранит глобальные сущности приложения: пользователь, токен, рабочий день, сотрудник.

Используй `entities`, если данные живут дольше одной страницы или нужны нескольким фичам.

Не клади в `entities` локальное состояние модалки, формы или конкретной страницы.

### `shared`

`shared` - инфраструктура, не домен.

Можно:

- API clients;
- generic config;
- context;
- theme;
- generic styled primitives;
- общие DTO-типы для shared API.

Нельзя:

- бизнес-логику фич;
- локальное состояние страниц;
- правила конкретной модалки;
- domain-specific UI, если он не переиспользуется.

### `widgets`

`widgets` - крупные layout-блоки, например `Header` и `Footer`.

Widgets могут подключать entities/shared state, если это нужно для layout.

## Суффиксы файлов

Используй только понятные role suffixes:

- `.view.tsx` - React-компонент;
- `.reatom.ts` - Reatom atoms/actions/resources;
- `.types.ts` - TypeScript-типы;
- `.constants.ts` - константы;
- `.utils.ts` - чистые функции;
- `.service.ts` - API/business service;
- `.hook.ts` - React hook.

Не создавай:

- `model.ts`;
- `types.ts`;
- `styles.ts` в новом коде, если можно дать более конкретное имя;
- непонятный `index.ts` с широким экспортом.

Текущий проект еще содержит legacy `styles.ts` и некоторые `index.ts`. Не размножай этот паттерн. Если трогаешь модуль, предпочитай конкретные имена и public API только при реальной внешней необходимости.

## Public API

`index.ts` допустим только если модуль реально импортируется снаружи как public API.

Правила:

- не используй `export *`;
- экспортируй только реально внешний API;
- не экспортируй внутренние row/section/helper-компоненты;
- не создавай `index.ts` “на всякий случай”.

## Типы

Типы всегда выносятся в `.types.ts`, рядом с основным файлом модуля.

Правила:

- `no any`;
- массивы записываются как `Comment[]`, не `Array<Comment>`;
- props-компонента лежат в `.types.ts`;
- DTO/API-типы лежат рядом с service/API;
- ключи object types желательно сортировать по алфавиту.

Пример:

```ts
export type CompanyMemberCardProps = {
    canDelete?: boolean
    member: CompanyMember
    onDelete: (memberId: string) => void
    onSelect: (memberId: string) => void
}
```

## Constants

Константы выносятся в `.constants.ts`.

Примеры:

- размеры модалки;
- mock data;
- select options;
- фиксированные labels/options.

Не оставляй большие mock arrays внутри `.view.tsx` или `.service.ts`.

## Utils

Чистые функции выносятся в `.utils.ts`.

Utils не должны:

- читать atoms;
- делать API-запросы;
- работать с React state;
- иметь side effects.

Хорошие utils:

- `getFilteredInviteUsers`;
- `getInviteUserInitials`;
- `generateCalendarDays`.

## Reatom

Reatom state/actions/resources живут в `.reatom.ts`.

Правила:

- состояние конкретной фичи лежит рядом с этой фичей;
- page не должен становиться складом atom-ов для дочерних модалок;
- actions называются с глагола: `openInviteMemberModalAction`, `closeSettingsModalAction`;
- atoms называются существительными или boolean-флагами с `is/has/can/should`, если это boolean;
- `reatomResource` не создавать в `pages`.

## Services

`.service.ts` содержит API/business async/resource logic.

Типы сервиса выносятся в `.types.ts`.
Константы/моки сервиса выносятся в `.constants.ts`.
Чистые фильтры/мапперы выносятся в `.utils.ts`.

Если service зависит от конкретной фичи, держи его в `features/<domain>`.
Если это generic HTTP API, держи его в `shared`.

## Components

Ориентир размера `.view.tsx`:

- до 150 строк - хорошо;
- 150-180 строк - допустимо;
- больше 180 строк - нужно искать естественный split.

Не дроби компонент ради формального количества строк, если split ухудшает понимание. Но если внутри есть row, section, panel, modal body - выноси в отдельный `.view.tsx`.

Handlers:

- обработчики называются `handle...`;
- если обработчик в JSX больше одной короткой строки, вынеси его в тело компонента;
- не оставляй многострочные callbacks в props.

Пример:

```tsx
const handleDeleteMember = () => {
    deleteMemberAction(ctx, member.id)
}

return <Button onClick={handleDeleteMember}>Удалить</Button>
```

## Imports

Используй алиасы:

- `$features/...`
- `$pages/...`
- `$widgets/...`
- `$entities/...`
- `$shared/...`

Относительные импорты допустимы внутри одного модуля для соседних файлов:

```ts
import { AccessSection } from './access-section.view.tsx'
import type { AccessSectionProps } from './access-section.types.ts'
```

Не импортируй внутренние файлы другой фичи, если у нее есть корректный public API и импортируется внешний view. Исключение - page-local feature models, когда page оркестрирует конкретную фичу напрямую.

## Decision Tree

Перед созданием файла задай вопросы:

1. Это UI-компонент?
   - Да: `.view.tsx`.

2. Это состояние, action, async или resource?
   - Да: `.reatom.ts`.

3. Это тип?
   - Да: `.types.ts`.

4. Это константа или mock data?
   - Да: `.constants.ts`.

5. Это чистая функция без side effects?
   - Да: `.utils.ts`.

6. Это API или business async service?
   - Да: `.service.ts`.

7. Это используется несколькими слоями?
   - Если глобальная сущность: `entities`.
   - Если инфраструктура: `shared`.
   - Если часть интерфейса: `features`.

## Refactor Rules for LLM

Когда пользователь просит “отрефакторить по архитектуре”:

1. Сначала сделай аудит `client/src`.
2. Не меняй поведение без необходимости.
3. Не создавай абстракции “на будущее”.
4. Переноси атомы из page в feature, если они относятся к feature.
5. Убирай лишние props у page-local модалок.
6. Выноси типы/константы/utils перед дроблением UI.
7. После каждого крупного блока запускай `tsc -b`.
8. В финале перечисли, что осталось как legacy/следующий кандидат.

## Current Important Project Notes

- `features/company/company-modals` не используется и не должен возвращаться как aggregate/container слой.
- Company modal state разнесен по конкретным модалкам.
- `doc-utils.md` содержит каталог текущих утилит и сервисов.
- `llm-project-structure.md` содержит правила для LLM-агентов.
