export const idl = {
    "address": "7iLFBYxQFx4QL9GHmeh6ELJBiizavd7dTWxi1sQNjsJ5",
    "metadata": {
        "name": "keep_it_real",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
    },
    "instructions": [
        {
            "name": "mintMemory",
            "discriminator": [13, 175, 116, 95, 164, 199, 151, 15],
            "accounts": [
                {
                    "name": "realityProof",
                    "writable": true,
                    "signer": false
                },
                {
                    "name": "user",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "daoTreasury",
                    "writable": true,
                    "signer": false
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111",
                    "writable": false,
                    "signer": false
                }
            ],
            "args": [
                {
                    "name": "imageHash",
                    "type": {
                        "array": ["u8", 32]
                    }
                },
                {
                    "name": "ipfsCid",
                    "type": "string"
                },
                {
                    "name": "appSignature",
                    "type": {
                        "array": ["u8", 64]
                    }
                },
                {
                    "name": "timestamp",
                    "type": "i64"
                }
            ]
        },
        {
            "name": "revokeMemory",
            "discriminator": [43, 184, 66, 119, 163, 164, 140, 17],
            "accounts": [
                {
                    "name": "realityProof",
                    "writable": true,
                    "signer": false
                },
                {
                    "name": "user",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111",
                    "writable": false,
                    "signer": false
                }
            ],
            "args": []
        }
    ],
    "accounts": [
        {
            "name": "RealityProof",
            "discriminator": [245, 170, 92, 135, 16, 21, 150, 154]
        }
    ],
    "types": [
        {
            "name": "RealityProof",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "owner",
                        "type": "publicKey"
                    },
                    {
                        "name": "imageHash",
                        "type": {
                            "array": ["u8", 32]
                        }
                    },
                    {
                        "name": "ipfsCid",
                        "type": "string"
                    },
                    {
                        "name": "appSignature",
                        "type": {
                            "array": ["u8", 64]
                        }
                    },
                    {
                        "name": "timestamp",
                        "type": "i64"
                    },
                    {
                        "name": "isVerified",
                        "type": "bool"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "InvalidCid",
            "msg": "IPFS CID is invalid or too long."
        },
        {
            "code": 6001,
            "name": "TimeDriftTooLarge",
            "msg": "The timestamp provided differs too much from on-chain time."
        }
    ]
};
