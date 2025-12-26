'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  VStack,
  Heading,
  Text,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Container,
  Icon,
  ScaleFade,
} from '@chakra-ui/react';
import { FaLock, FaRocket } from 'react-icons/fa';

export default function Home() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const bgGradient = useColorModeValue(
    'linear(to-br, purple.50, blue.50, pink.50)',
    'linear(to-br, dark.900, purple.900, dark.800)'
  );

  const cardBg = useColorModeValue('whiteAlpha.900', 'whiteAlpha.50');
  const cardBorder = useColorModeValue('whiteAlpha.400', 'whiteAlpha.100');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
      } else {
        localStorage.setItem('isAuthenticated', 'true');
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Failed to login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient={bgGradient}
      position="relative"
      overflow="hidden">
      {/* Animated background elements */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w="500px"
        h="500px"
        borderRadius="full"
        bgGradient="linear(to-br, primary.400, brand.400)"
        opacity="0.1"
        filter="blur(80px)"
        animation="float 20s ease-in-out infinite"
      />
      <Box
        position="absolute"
        bottom="-10%"
        left="-5%"
        w="400px"
        h="400px"
        borderRadius="full"
        bgGradient="linear(to-tr, accent.400, primary.400)"
        opacity="0.1"
        filter="blur(80px)"
        animation="float 15s ease-in-out infinite reverse"
      />

      <Container maxW="md" position="relative" zIndex={1}>
        <ScaleFade initialScale={0.9} in={true}>
          <VStack spacing={8}>
            {/* Logo/Icon */}
            <Box
              p={4}
              borderRadius="2xl"
              bgGradient="linear(to-br, primary.500, brand.500)"
              boxShadow="0 8px 32px rgba(86, 85, 215, 0.3)">
              <Icon as={FaRocket} w={12} h={12} color="white" />
            </Box>

            {/* Main Card */}
            <Box
              w="full"
              bg={cardBg}
              backdropFilter="blur(20px)"
              borderRadius="2xl"
              border="1px solid"
              borderColor={cardBorder}
              boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
              p={8}>
              <VStack spacing={6} align="stretch">
                <VStack spacing={2}>
                  <Heading
                    size="xl"
                    bgGradient="linear(to-r, primary.400, brand.400)"
                    bgClip="text"
                    textAlign="center">
                    Welcome Back
                  </Heading>
                  <Text
                    fontSize="sm"
                    color={useColorModeValue('gray.600', 'gray.400')}
                    textAlign="center">
                    Sign in to access the OTA Server Dashboard
                  </Text>
                </VStack>

                <form onSubmit={handleLogin}>
                  <VStack spacing={4}>
                    <FormControl isInvalid={!!error}>
                      <InputGroup size="lg">
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FaLock} color="gray.400" />
                        </InputLeftElement>
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter admin password"
                          borderRadius="lg"
                          bg={useColorModeValue('white', 'dark.800')}
                          border="2px solid"
                          borderColor={useColorModeValue('gray.200', 'dark.700')}
                          _hover={{
                            borderColor: useColorModeValue('primary.300', 'primary.600'),
                          }}
                          _focus={{
                            borderColor: 'primary.500',
                            boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                          }}
                        />
                      </InputGroup>
                      {error && (
                        <FormErrorMessage fontSize="sm" mt={2} color="red.400">
                          {error}
                        </FormErrorMessage>
                      )}
                    </FormControl>

                    <Button
                      type="submit"
                      size="lg"
                      width="full"
                      bgGradient="linear(to-r, primary.500, brand.500)"
                      color="white"
                      fontWeight="600"
                      borderRadius="lg"
                      isLoading={isLoading}
                      loadingText="Signing in..."
                      _hover={{
                        bgGradient: 'linear(to-r, primary.600, brand.600)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 24px rgba(86, 85, 215, 0.3)',
                      }}
                      _active={{
                        transform: 'translateY(0)',
                      }}
                      transition="all 0.2s">
                      Sign In
                    </Button>
                  </VStack>
                </form>
              </VStack>
            </Box>

            {/* Footer text */}
            <Text
              fontSize="xs"
              color={useColorModeValue('gray.500', 'gray.500')}
              textAlign="center">
              Vishnu Custom OTA Server • Secure Update Management
            </Text>
          </VStack>
        </ScaleFade>
      </Container>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>
    </Box>
  );
}
