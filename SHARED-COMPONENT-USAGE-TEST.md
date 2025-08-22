# Sprint 4 Implementation Test - Shared Component Usage

## Testing Shared Button Component

Here's how to use the new shared Button component in both web and React Native:

### Web Usage (in React app)
```tsx
import { Button } from '@cheforg/shared/ui';

function MyComponent() {
  return (
    <Button
      title="Reservar Mesa"
      onPress={() => console.log('Reserva clicked')}
      variant="primary"
      size="large"
      loading={false}
    />
  );
}
```

### React Native Usage
```tsx
import { NativeButton } from '../components/NativeButton';

export const MyScreen = () => {
  return (
    <NativeButton
      title="Reservar Mesa"
      onPress={() => console.log('Reserva clicked')}
      variant="primary"
      size="large"
      loading={false}
    />
  );
};
```

## Testing Shared Constants

### Import shared constants
```tsx
import { COLORS, SPACING, ROUTES } from '@cheforg/shared/constants';

// Use in web CSS
const buttonStyle = {
  backgroundColor: COLORS.primary[600],
  padding: SPACING.md,
};

// Use in React Native StyleSheet
const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary[600],
    paddingVertical: SPACING.md,
  },
});
```

## Testing Shared Types

```tsx
import type { MenuItem, Reserva } from '@cheforg/shared/types';

const item: MenuItem = {
  id: '1',
  nome: 'Hambúrguer Gourmet',
  preco: 28.50,
  categoria: 'principais',
  disponivel: true,
  tempo_preparo: 15,
  ingredientes: ['pão', 'carne', 'queijo']
};

const reserva: Reserva = {
  id: '1',
  clienteNome: 'João Silva',
  clienteCpf: '12345678901',
  clienteTelefone: '(11) 99999-9999',
  dataHora: new Date(),
  numeroConvidados: 4,
  status: 'confirmada'
};
```

This demonstrates that our shared components, types, and constants work seamlessly across both web and mobile platforms.