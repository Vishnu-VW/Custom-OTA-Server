import {
  Box,
  Flex,
  VStack,
  Button,
  FlexProps,
  useColorMode,
  useColorModeValue,
  IconButton,
  HStack,
  Text,
  Divider,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import {
  FaSignOutAlt,
  FaTachometerAlt,
  FaTags,
  FaMoon,
  FaSun,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { useRef } from 'react';

export default function Layout({ children, ...props }: { children: React.ReactNode } & FlexProps) {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt fontSize="1.25rem" /> },
    { name: 'Releases', path: '/releases', icon: <FaTags fontSize="1.25rem" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/');
  };

  const sidebarBg = useColorModeValue('whiteAlpha.800', 'dark.800');
  const sidebarBorder = useColorModeValue('gray.200', 'dark.700');
  const headerBg = useColorModeValue('white', 'dark.800');
  const headerBorder = useColorModeValue('gray.200', 'dark.700');

  return (
    <Box className="w-full" height="100vh" bg={useColorModeValue('gray.50', 'dark.900')} {...props}>
      {/* Header */}
      <Box
        w="full"
        h="80px"
        bg={headerBg}
        borderBottom="1px solid"
        borderColor={headerBorder}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={8}
        position="sticky"
        top={0}
        zIndex={10}
        backdropFilter="blur(10px)"
        boxShadow="sm">
        <HStack spacing={4}>
          {/* <Box p={2} borderRadius="lg" bgGradient="linear(to-br, primary.500, brand.500)">
            <Image
              src="/xavia_logo.png"
              width={120}
              height={40}
              style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              alt="Vishnu Custom OTA Logo"
            />
          </Box> */}
          {/* <Divider orientation="vertical" h="40px" /> */}
          <VStack align="start" spacing={0}>
            <Text fontSize="lg" fontWeight="700">
              Vishnu Custom OTA
            </Text>
            <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')}>
              Update Management Dashboard
            </Text>
          </VStack>
        </HStack>

        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
          onClick={toggleColorMode}
          variant="ghost"
          size="lg"
          borderRadius="lg"
          _hover={{
            bg: useColorModeValue('gray.100', 'dark.700'),
          }}
        />
      </Box>

      <Flex className="h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <Box
          w="280px"
          bg={sidebarBg}
          backdropFilter="blur(10px)"
          borderRight="1px solid"
          borderColor={sidebarBorder}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p={6}>
          <VStack spacing={3} align="stretch">
            <Text
              fontSize="xs"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="wider"
              color={useColorModeValue('gray.500', 'gray.500')}
              mb={2}>
              Navigation
            </Text>
            {navItems.map((item) => {
              const isActive = router.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'solid' : 'ghost'}
                  size="lg"
                  justifyContent="flex-start"
                  leftIcon={item.icon}
                  onClick={() => router.push(item.path)}
                  bg={isActive ? 'primary.500' : 'transparent'}
                  color={isActive ? 'white' : useColorModeValue('gray.700', 'gray.300')}
                  fontWeight={isActive ? '600' : '500'}
                  borderRadius="xl"
                  _hover={{
                    bg: isActive ? 'primary.600' : useColorModeValue('gray.100', 'dark.700'),
                    transform: 'translateX(4px)',
                  }}
                  _active={{
                    transform: 'translateX(2px)',
                  }}
                  transition="all 0.2s"
                  position="relative"
                  overflow="hidden"
                  _before={
                    isActive
                      ? {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '4px',
                          bgGradient: 'linear(to-b, brand.400, accent.400)',
                          borderRadius: 'full',
                        }
                      : undefined
                  }>
                  {item.name}
                </Button>
              );
            })}
          </VStack>

          <VStack spacing={3} align="stretch">
            <Divider />
            <Button
              variant="outline"
              size="lg"
              colorScheme="red"
              onClick={onOpen}
              leftIcon={<FaSignOutAlt />}
              borderRadius="xl"
              fontWeight="600"
              _hover={{
                bg: 'red.500',
                color: 'white',
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              transition="all 0.2s">
              Logout
            </Button>
          </VStack>
        </Box>

        {/* Main Content */}
        <Box flex={1} p={8} overflowY="auto" bg={useColorModeValue('gray.50', 'dark.900')}>
          {children}
        </Box>
      </Flex>

      {/* Logout Confirmation Dialog */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay backdropFilter="blur(4px)">
          <AlertDialogContent borderRadius="2xl" mx={4} bg={useColorModeValue('white', 'dark.800')}>
            <AlertDialogHeader fontSize="xl" fontWeight="700">
              <HStack spacing={3}>
                <Box p={2} borderRadius="lg" bg={useColorModeValue('orange.100', 'orange.900')}>
                  <FaExclamationTriangle color="orange" size={20} />
                </Box>
                <Text>Confirm Logout</Text>
              </HStack>
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text color={useColorModeValue('gray.600', 'gray.400')}>
                Are you sure you want to logout? You will need to sign in again to access the
                dashboard.
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter gap={3}>
              <Button ref={cancelRef} onClick={onClose} variant="ghost" borderRadius="lg" size="lg">
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleLogout}
                borderRadius="lg"
                size="lg"
                fontWeight="600"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s">
                Yes, Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
