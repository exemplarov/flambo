# Flambo

A lightweight TypeScript decorator library for building modular class-based applications. Flambo provides utility decorators that reduce boilerplate code while maintaining clean architecture principles.

## Installation

```bash
npm install flambo
```

```bash
yarn add flambo
```

## Features

- 🪶 Lightweight with zero dependencies
- 🎯 TypeScript-first approach
- 🧩 Modular - use only what you need
- 🔒 Type-safe environment variables handling
- 📦 Property memoization
- 📝 Metadata collection utilities

## Decorators

### @Once
Memoizes getter results after the first call. Perfect for expensive computations or one-time initializations.

```typescript
class UserService {
  // Without @Once
  private _config: Config | null = null;
  get config(): Config {
    if (!this._config) {
      this._config = new Config();
    }
    return this._config;
  }

  // With @Once
  @Once()
  get config() {
    return new Config();
  }
}
```

### @Env
Simplifies environment variable handling with type conversion and default values.

```typescript
class ServerConfig {
  @Env(3000)
  port: number;

  @Env({ type: String, default: 'development' })
  nodeEnv: string;

  @Env({ type: 'json', key: 'DB_CONFIG' })
  dbConfig: DatabaseConfig;
}
```

### @PushTo
Collects decorated property names into an array. Useful for metadata collection and reflection.

```typescript
class ValidationRules {
  // Array can be explicitly defined for type safety
  public requiredFields: string[];

  @PushTo('requiredFields')
  username: string;

  @PushTo('requiredFields')
  password: string;

  // Decorator automatically creates: requiredFields = ['username', 'password']
}
```

## Usage Examples

```typescript
import { Once, Env, PushTo } from 'flambo';

class AppConfig {
  public initTasks: string[];

  @Env({ type: Number, default: 3000 })
  port: number;

  @Once()
  get databaseUrl(): string {
    return this.buildDatabaseUrl();
  }

  @PushTo('initTasks')
  async connectDatabase() {
    // ...
  }
}
```

## Why Flambo?

Flambo provides lightweight decorators that enhance your classes without enforcing a specific architecture. This makes it perfect for:

- Building modular services
- Handling configuration
- Creating pure class-based containers
- Reducing boilerplate code
- Getting rid of DI frameworks
- Gradual refactoring without rewriting the whole codebase

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.