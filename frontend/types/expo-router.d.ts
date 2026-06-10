declare module 'expo-router' {
  import type { ComponentType, ReactNode } from 'react';

  export type Href = string;

  export type RedirectProps = {
    href: Href;
  };

  export const Redirect: ComponentType<RedirectProps>;

  type LinkCompound = ComponentType<{
    children?: ReactNode;
    href?: Href;
    replace?: boolean;
  }> & {
    Trigger: ComponentType<{ children?: ReactNode }>;
    Preview: ComponentType<Record<string, never>>;
    Menu: ComponentType<{ children?: ReactNode; title?: string; icon?: string }>;
    MenuAction: ComponentType<{
      destructive?: boolean;
      icon?: string;
      onPress?: () => void;
      title: string;
    }>;
  };

  export const Link: LinkCompound;

  export const Stack: ComponentType<{
    children?: ReactNode;
    screenOptions?: Record<string, unknown>;
  }> & {
    Screen: ComponentType<{
      name: string;
      options?: Record<string, unknown>;
    }>;
  };

  export const Tabs: ComponentType<{
    children?: ReactNode;
    screenOptions?: Record<string, unknown>;
  }> & {
    Screen: ComponentType<{
      name: string;
      options?: Record<string, unknown>;
    }>;
  };

  export function useRouter(): {
    back: () => void;
    push: (href: Href) => void;
    replace: (href: Href) => void;
  };
}
