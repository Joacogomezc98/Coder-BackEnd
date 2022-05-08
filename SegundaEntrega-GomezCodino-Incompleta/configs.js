export default {
    port: process.env.PORT || 8080,
    firestore: {
      "type": "service_account",
      "project_id": "e-drink-backend",
      "private_key_id": "a3dc61118ec698ce302bd527a5dfe42b1d4b356c",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7bJjwBnjZE6cd\nluvJO1ijxZPB30EMx/U5VYllJnxNJZws6nc8BCjVnTHzA+0SqakNHVCT5B8nw1FV\ndT+a7ENd/NkL1CmGQAw0siqnTRu0ul1XgJw+GT7N9ZY52Mu+2sX2t5U/m+fSMl1H\n/GVvnJxThiHN8z8jNwnYk65PcGNEgZWF2VJx3JXOVCssdt7gFbwICkHX5NEqLtaW\n0Mbft+QbnQjxnf+dqemK8g2LULDPXgKUI2RPnlatA6OP/zAG4k8wM1buhOhsA2YQ\nyxLtHLk64kU9isJGGGXBB8qB5x1b3wC+30lIJArlvnV8SpYmsXtSBFzidlxSXJPD\nV/+DD/QVAgMBAAECggEAMtxK+mO/OqU/JeP1M0QED1lH+gX0GJxQmxDvun/BnovU\nwEmWNraoQCOq0NghZv2cbv8kBSYUIE28DhVFv+xacbByU+fsps5NoaUxtvnRSW+D\ncgHoJF/kb66z6BnBXJbwvr1d5oeP1rYtIyJGgo28zFurY8CdQxil9txIoq0MeyO5\n3uTRJ8SmC1ZZVkA/YxDCW9DKVD4LwBP2PARuLRt2YqBJnZogFfNKRNGhaNf1UOrN\nzdBGb5+6ygo0Cu0ozr8VIMZTfXfBAj2l16bgHcG94u2OaJFiBvRzUPxE/vZFTUV4\n9kXz/N5mb91c7urHXitStg2uJGZqoaYf5Rj/LgWlBwKBgQDt0W857hWhX8FBM4cj\nWARlhMefZB8/TxY7fb57xUT5WVH2ADovvRJcNkbSxdjzWQ2aDSyqZVS9Zbq3nLcV\nUk+aCXiRgmuWodqrOez1BBuEArAKSldkZrqyhjvS6H2DT/WqefTfhF0NBE7zF/Jt\nZthBoN2PyHJXrjJ+p9nWvU5RUwKBgQDJwNsXoq2LPnClLBQ/4ozAMk2bvJh6mYLv\nFylsMiPtUA45h3T13uNWFTY/uTSaAMJcEShXNpGuRN+17tEB8N3DPQjbm3QXhx08\nDhFQfaFsqF+ypWpcFwXcUeJmwC4vNaMpAIG7b1Gg5SjSEaqK1azVkosI7Jtyy2+t\n8+qh9cHv9wKBgFVryLvSHMreDhhRXdUAJHQigWFrIR4oViAARo9GiEPYJWxrIHtN\nOm8Mv9utXQPrlMskuEpsI0f0ZmDVVZ2+9wCpLjl10xdEA7tFDyvi0c9U9856bXGO\nxLijJpHXGF42NlOJgr9WV+X5CjKfA2Dwc/T+xxaCNS/xTgnYWJKdZKgpAoGBALd7\nj0WViyMBrExrJBddoAgDN5WVFU8aYXuzotZlW0st7WHgkTwycqoNLIMTmoUcf6Zf\nbEK0vBSzSokZIjgTqHsw/OdMH25uUOYXHSQIvVAmaLH9whbyUUAnsDEmQlpo+3QE\no/ekq6YaAt/ZdTJCVab+WTfKhy0FWxHmrNKSwMfNAoGBAMQ69ruHW0wCllO77N/w\nQ5DDbEm6xQj7oqido/W3Cf/gFGTinC/q3SuUU/k/NrQMLmdI3SCEJWAIoXX63+q3\n5i6GliFB0l1Y3XV2PggTFA17yULQmqwqUujnFF82Ft65phphtHNdPC2LSW3lUltg\n8CYWloAeQJLH3ABovd+27y9a\n-----END PRIVATE KEY-----\n",
      "client_email": "firebase-adminsdk-eptyf@e-drink-backend.iam.gserviceaccount.com",
      "client_id": "110369653675856019747",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-eptyf%40e-drink-backend.iam.gserviceaccount.com"
    }
    ,
    db: "mongodb"
  }