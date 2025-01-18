This library imlements Inherited Authentication pattern.

When you have dependent entities you may need to inherit access rights. 
For example you have workspace entity and users are able to mange access to it. 
And you have different items in this workspace: documents, images, files. 
So every user who has access to workspace should have access to these items.
With this library you can request special token for workspace and use it to get access to dependent items without check access multiple times.

Usage:
1. Implement `IRuleStore` to save inheritance rules: (entity A is dependent on entity B)
2. Implement `IWithdrawStore` if you want to deny some inheitance
3. Use `Authenticator` and `Validator` to issue and validate tokens
