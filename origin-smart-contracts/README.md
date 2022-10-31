# Origin Passport NFT

Origin is a startup society for web3 futurists. To build a decentralised future, we need to experience it first.

The Origin Passport - a non-transferrable NFT that unlocks access to the Origin community ecosystem. Origin passports are issued to members who are accepted into the community and will be your key to unlock all citizen benefits.

In practice, the Origin Passport is a customised ERC-721 token deployed to Polygon.

We overwrite the transfer function to make the tokens non-transferable and only allow a community admin to mint new tokens.
We also created a burn function that lets either the owner or the community burn a member's token and rescind their membership.
