'use client';

import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: true,
  };

  const theme = extendTheme({
    config,
    fonts: {
      heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
      body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    },
    colors: {
      brand: {
        50: '#f0e4ff',
        100: '#d4b8ff',
        200: '#b88bff',
        300: '#9c5eff',
        400: '#8031ff',
        500: '#6610f2',
        600: '#5a0dd4',
        700: '#4d09b6',
        800: '#400698',
        900: '#33037a',
      },
      primary: {
        50: '#e8e7ff',
        100: '#c5c3ff',
        200: '#a19fff',
        300: '#7d7bff',
        400: '#5957ff',
        500: '#5655D7',
        600: '#4d4cc1',
        700: '#4443ab',
        800: '#3b3a95',
        900: '#32317f',
      },
      accent: {
        50: '#fff0f5',
        100: '#ffd6e7',
        200: '#ffadd2',
        300: '#ff85bd',
        400: '#ff5ca8',
        500: '#ff3393',
        600: '#e62e85',
        700: '#cc2977',
        800: '#b32469',
        900: '#991f5b',
      },
      dark: {
        50: '#f7f7f8',
        100: '#e1e1e6',
        200: '#c4c4cd',
        300: '#a8a8b4',
        400: '#8b8b9b',
        500: '#6f6f82',
        600: '#525269',
        700: '#3a3a50',
        800: '#232337',
        900: '#0b0b1e',
      },
    },
    styles: {
      global: (props: any) => ({
        body: {
          bg: props.colorMode === 'dark' ? 'dark.900' : 'gray.50',
          color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
        },
      }),
    },
    components: {
      Button: {
        baseStyle: {
          fontWeight: '600',
          borderRadius: 'lg',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          transition: 'all 0.2s',
        },
        variants: {
          solid: (props: any) => ({
            bg: props.colorScheme === 'primary' ? 'primary.500' : undefined,
            bgGradient:
              props.colorScheme === 'primary' ? 'linear(to-r, primary.500, brand.500)' : undefined,
            _hover: {
              bgGradient:
                props.colorScheme === 'primary'
                  ? 'linear(to-r, primary.600, brand.600)'
                  : undefined,
            },
          }),
          glass: {
            bg: 'whiteAlpha.100',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: 'whiteAlpha.200',
            _hover: {
              bg: 'whiteAlpha.200',
            },
          },
        },
      },
      Card: {
        baseStyle: (props: any) => ({
          container: {
            borderRadius: 'xl',
            overflow: 'hidden',
            transition: 'all 0.3s',
            _hover: {
              transform: 'translateY(-4px)',
              boxShadow: '2xl',
            },
          },
        }),
        variants: {
          glass: (props: any) => ({
            container: {
              bg: props.colorMode === 'dark' ? 'whiteAlpha.50' : 'whiteAlpha.900',
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.200',
              boxShadow: 'xl',
            },
          }),
          gradient: {
            container: {
              bgGradient: 'linear(135deg, primary.500, brand.500)',
              color: 'white',
            },
          },
        },
      },
      Table: {
        variants: {
          modern: (props: any) => ({
            table: {
              borderCollapse: 'separate',
              borderSpacing: '0 8px',
            },
            th: {
              textTransform: 'uppercase',
              fontSize: 'xs',
              fontWeight: '700',
              letterSpacing: '0.05em',
              color: props.colorMode === 'dark' ? 'gray.400' : 'gray.600',
              borderBottom: 'none',
              bg: 'transparent',
            },
            td: {
              bg: props.colorMode === 'dark' ? 'dark.800' : 'white',
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: props.colorMode === 'dark' ? 'dark.700' : 'gray.200',
              _first: {
                borderLeft: '1px solid',
                borderLeftColor: props.colorMode === 'dark' ? 'dark.700' : 'gray.200',
                borderTopLeftRadius: 'lg',
                borderBottomLeftRadius: 'lg',
              },
              _last: {
                borderRight: '1px solid',
                borderRightColor: props.colorMode === 'dark' ? 'dark.700' : 'gray.200',
                borderTopRightRadius: 'lg',
                borderBottomRightRadius: 'lg',
              },
            },
            tr: {
              transition: 'all 0.2s',
              _hover: {
                td: {
                  bg: props.colorMode === 'dark' ? 'dark.700' : 'gray.50',
                },
              },
            },
          }),
        },
      },
    },
  });

  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
