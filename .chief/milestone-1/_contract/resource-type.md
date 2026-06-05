# Resource Type Contract

## ISwapAppService Extension

Add optional `resourceType` field to `ISwapAppService`:

```ts
export type ResourceType = 'webapp' | 'function_app';

export interface ISwapAppService {
  // ... existing fields ...
  resourceType?: ResourceType;
}
```

## Default Behavior

When `resourceType` is omitted or undefined, it defaults to `'webapp'`. This ensures full backwards compatibility.

## Zod Validation

Update `SwapAppServiceSchema` to accept:

```ts
resourceType: z.enum(['webapp', 'function_app']).optional(),
```

## Function App CLI Commands

Parallel to existing `az webapp` commands:

| Web App Command | Function App Command |
|---|---|
| `az webapp config appsettings list` | `az function_app config appsettings list` |
| `az webapp config appsettings set` | `az function_app config appsettings set` |
| `az webapp config connection-string list` | `az function_app config connection-string list` |
| `az webapp config connection-string set` | `az function_app config connection-string set` |
| `az webapp deployment slot swap` | `az function_app deployment slot swap` |

## Function App Warnings

When `resourceType: 'function_app'`, emit `core.warning()` for these settings if not `slotSetting: true`:

- `AzureWebJobsStorage`
- `FUNCTIONS_WORKER_RUNTIME`
- `FUNCTIONS_EXTENSION_VERSION`
- `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`
- `WEBSITE_CONTENTSHARE`

Warnings are non-blocking (do not throw errors).
