import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Heading,
  Button,
  Tag,
  HStack,
  IconButton,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  Flex,
  Tooltip,
  VStack,
  useColorModeValue,
  Badge,
  Card,
  CardBody,
  Spinner,
} from '@chakra-ui/react';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { SlRefresh } from 'react-icons/sl';
import { FaCode, FaClock, FaDatabase } from 'react-icons/fa';

import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import { showToast } from '../components/toast';

interface Release {
  path: string;
  runtimeVersion: string;
  timestamp: string;
  size: number;
  commitHash: string | null;
  commitMessage: string | null;
}

export default function ReleasesPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const tableBg = useColorModeValue('white', 'dark.800');
  const headerBg = useColorModeValue('gray.50', 'dark.700');

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/releases');
      if (!response.ok) {
        throw new Error('Failed to fetch releases');
      }
      const data = await response.json();
      setReleases(data.releases);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch releases');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Flex justify="space-between" align="center">
            <Box>
              <Heading
                size="2xl"
                mb={2}
                bgGradient="linear(to-r, primary.400, brand.500)"
                bgClip="text">
                Releases
              </Heading>
              <Text color={useColorModeValue('gray.600', 'gray.400')}>
                Manage and monitor your OTA releases
              </Text>
            </Box>
            <IconButton
              aria-label="Refresh"
              onClick={fetchReleases}
              icon={<SlRefresh />}
              size="lg"
              colorScheme="primary"
              borderRadius="xl"
              isLoading={loading}
              _hover={{
                transform: 'rotate(180deg)',
              }}
              transition="all 0.3s"
            />
          </Flex>

          {/* Loading State */}
          {loading && (
            <Card bg={tableBg} borderRadius="2xl" p={8}>
              <Flex justify="center" align="center" direction="column" gap={4}>
                <Spinner size="xl" color="primary.500" thickness="4px" />
                <Text color={useColorModeValue('gray.600', 'gray.400')}>Loading releases...</Text>
              </Flex>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card bg="red.50" borderRadius="2xl" p={6} borderLeft="4px solid" borderColor="red.500">
              <Text color="red.600" fontWeight="600">
                {error}
              </Text>
            </Card>
          )}

          {/* Releases Table */}
          {!loading && !error && (
            <Card bg={tableBg} borderRadius="2xl" overflow="hidden">
              <Box overflowX="auto">
                <Table variant="modern">
                  <Thead bg={headerBg}>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Runtime Version</Th>
                      <Th>Commit Hash</Th>
                      <Th>Commit Message</Th>
                      <Th>Timestamp (UTC)</Th>
                      <Th>File Size</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {releases
                      .sort(
                        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                      )
                      .map((release, index) => (
                        <Tr key={index}>
                          <Td>
                            <HStack>
                              <Box
                                w={2}
                                h={2}
                                borderRadius="full"
                                bg={index === 0 ? 'green.400' : 'gray.400'}
                              />
                              <Text fontWeight="600">{release.path}</Text>
                            </HStack>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme="purple"
                              fontSize="sm"
                              px={3}
                              py={1}
                              borderRadius="lg">
                              {release.runtimeVersion}
                            </Badge>
                          </Td>
                          <Td>
                            <Tooltip label={release.commitHash}>
                              <HStack spacing={2}>
                                <FaCode color="gray" />
                                <Text
                                  isTruncated
                                  maxW="120px"
                                  fontFamily="mono"
                                  fontSize="sm"
                                  color={useColorModeValue('gray.600', 'gray.400')}>
                                  {release.commitHash || 'N/A'}
                                </Text>
                              </HStack>
                            </Tooltip>
                          </Td>
                          <Td>
                            <Tooltip label={release.commitMessage}>
                              <Text
                                isTruncated
                                maxW="200px"
                                fontSize="sm"
                                color={useColorModeValue('gray.600', 'gray.400')}>
                                {release.commitMessage || 'No message'}
                              </Text>
                            </Tooltip>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <FaClock size={14} color="gray" />
                              <Text fontSize="sm" fontFamily="mono">
                                {moment(release.timestamp).utc().format('MMM DD, HH:mm')}
                              </Text>
                            </HStack>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <FaDatabase size={14} color="gray" />
                              <Text fontSize="sm" fontWeight="600">
                                {formatFileSize(release.size)}
                              </Text>
                            </HStack>
                          </Td>
                          <Td>
                            {index === 0 ? (
                              <Badge
                                colorScheme="green"
                                fontSize="sm"
                                px={4}
                                py={2}
                                borderRadius="lg"
                                fontWeight="600">
                                Active Release
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                colorScheme="orange"
                                borderRadius="lg"
                                fontWeight="600"
                                onClick={() => {
                                  setIsOpen(true);
                                  setSelectedRelease(release);
                                }}
                                _hover={{
                                  transform: 'translateY(-2px)',
                                  boxShadow: 'md',
                                }}
                                transition="all 0.2s">
                                Rollback
                              </Button>
                            )}
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </Box>
            </Card>
          )}
        </VStack>

        {/* Rollback Confirmation Dialog */}
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsOpen(false)}
          isCentered>
          <AlertDialogOverlay backdropFilter="blur(4px)">
            <AlertDialogContent
              borderRadius="2xl"
              mx={4}
              bg={useColorModeValue('white', 'dark.800')}>
              <AlertDialogHeader fontSize="xl" fontWeight="700">
                Rollback Release
              </AlertDialogHeader>

              <AlertDialogBody>
                <VStack spacing={4} align="stretch">
                  <Text color={useColorModeValue('gray.600', 'gray.400')}>
                    Are you sure you want to rollback to this release?
                  </Text>

                  <Card bg={useColorModeValue('green.50', 'green.900')} borderRadius="xl" p={4}>
                    <VStack align="start" spacing={2}>
                      <Text fontSize="xs" fontWeight="600" color="green.600">
                        COMMIT HASH
                      </Text>
                      <Text
                        fontSize="sm"
                        fontFamily="mono"
                        fontWeight="600"
                        color={useColorModeValue('green.700', 'green.300')}>
                        {selectedRelease?.commitHash}
                      </Text>
                    </VStack>
                  </Card>

                  <Card bg={useColorModeValue('orange.50', 'orange.900')} borderRadius="xl" p={4}>
                    <Text fontSize="sm" color={useColorModeValue('orange.700', 'orange.300')}>
                      This will promote this release to be the active release with a new timestamp.
                    </Text>
                  </Card>
                </VStack>
              </AlertDialogBody>

              <AlertDialogFooter gap={3}>
                <Button
                  ref={cancelRef}
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  borderRadius="lg">
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/rollback', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          path: selectedRelease?.path,
                          runtimeVersion: selectedRelease?.runtimeVersion,
                          commitHash: selectedRelease?.commitHash,
                          commitMessage: selectedRelease?.commitMessage,
                        }),
                      });

                      if (!response.ok) {
                        throw new Error('Rollback failed');
                      }

                      showToast('Rollback successful', 'success');
                      fetchReleases();
                      setIsOpen(false);
                    } catch (err) {
                      showToast('Rollback failed', 'error');
                    }
                  }}
                  borderRadius="lg"
                  fontWeight="600">
                  Rollback
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Layout>
    </ProtectedRoute>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
