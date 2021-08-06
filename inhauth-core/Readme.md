# Inherited Authorization
Наследуемая авторизация иерархических структур

## About Problem

<div style="text-align: right">
This is the dog, that worried the cat,<br/>
That kill'd the rat, that ate the malt<br/>
That lay in the house that Jack built.<br/>
</div>

Suppose, you have hierarchy structure like a filesystem. 
You want to inherit authorization rules downside.
You have 2 options:
* check rules on each request upward (ask about auth rules of file, then of its folder, then of grandfolder, etc.)
* update rules on whole subtree on every auth-rules change (like in windows).

It might be slow in each case, and very slow in case of ditributed system where folder might be on other server.

## Solution

On each authenticated request you get a Resource Token, that confirms that you have access to it.
You can use it for request subresources: when server gets resource token it checks about auth inheritance rules and if requested resource inherits auth rules from resource token`s resource - success.
For example, if you are Jack and have owner rights on the malt, you can request access to the rat with malt's resource token.

## How to use it

```typescript
import { AuthManager } from "@hia/core";

const authManager = new AuthManager(withdrawStore, ruleStore);
// issue new token for resourceA. No auth check is made here
const tokenA = await authManager.issuer.Issue(resourceA, accessMode);
// auth access for resourceB with resourceA`s token (if resourceB inherits resourceA,it will be success)
const tokenB = await authManager.authenticator.Authenticate(resourceB, tokenA);
```

You need to implement some stores:
* IRuleStore: it stores AccessInheritanceRules for each resource 
* IWithdrawStore: it stores withdrawed resources 

/ Or you can use InMemory-implementations in dev /
