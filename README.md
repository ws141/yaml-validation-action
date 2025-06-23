# Remote YAML file validation with auth

Validates a YAML file by converting it to JSON and sending it to a remote HTTP API endpoint via a POST request.

The response should be of the following format:

```json
{
    "response": {
        "isValid": false,
        "errors": [
            "Error 1",
            "Error 2"
        ]
    }
}
```

`isValid` is a boolean which specifies whether the YAML definition is valid according to some rule set that the HTTP API endpoint can specify.
`errors` is a array of strings, each of which explains an error which makes the file invalid.
If `isValid` is `true`, then `errors` should be an empty array.

## Inputs

### `api-endpoint`

**Required** The URL for the HTTP API endpoint which validates the YAML file.

### `yaml-file`

**Required** The name of the YAML file to validate.

### `basic-auth-user`

The user name for basic authenticaton. Requires password to be set.

### `basic-auth-password`

The password for basic authenticaton. Requires user name to be set. 

## Example usage

```yaml
- name: Remote YAML file validation
  uses: ws141/yaml-validation-action@v1.6
  with:
    api-endpoint: 'http://example.com/validate'
    yaml-file: assignment.yml
    basic-auth-user: 'user'
    basic-auth-password: 'password'
```
