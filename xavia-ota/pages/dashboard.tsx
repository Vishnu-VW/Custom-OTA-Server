import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  SimpleGrid,
  Box,
  Text,
  Icon,
  HStack,
  VStack,
  useColorModeValue,
  Stat,
  StatNumber,
  StatHelpText,
  Flex,
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import { TrackingMetrics } from '../apiUtils/database/DatabaseInterface';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { AllTrackingResponse } from './api/tracking/all';
import { FaRocket, FaDownload, FaApple, FaAndroid } from 'react-icons/fa';

interface StatCardProps {
  title: string;
  value: number;
  icon: any;
  gradient: string;
  helpText?: string;
}

function StatCard({ title, value, icon, gradient, helpText }: StatCardProps) {
  const cardBg = useColorModeValue('white', 'dark.800');
  const iconBg = useColorModeValue('whiteAlpha.900', 'whiteAlpha.100');

  return (
    <Card
      variant="elevated"
      bg={cardBg}
      borderRadius="2xl"
      overflow="hidden"
      position="relative"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-8px)',
        boxShadow: '2xl',
      }}>
      {/* Gradient overlay */}
      <Box position="absolute" top={0} left={0} right={0} h="4px" bgGradient={gradient} />

      <CardBody p={6}>
        <Flex justify="space-between" align="start">
          <VStack align="start" spacing={3} flex={1}>
            <Text
              fontSize="sm"
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing="wider"
              color={useColorModeValue('gray.600', 'gray.400')}>
              {title}
            </Text>
            <Stat>
              <StatNumber fontSize="4xl" fontWeight="800" bgGradient={gradient} bgClip="text">
                {value.toLocaleString()}
              </StatNumber>
              {helpText && (
                <StatHelpText fontSize="xs" color={useColorModeValue('gray.500', 'gray.500')}>
                  {helpText}
                </StatHelpText>
              )}
            </Stat>
          </VStack>

          <Box p={4} borderRadius="xl" bg={iconBg} backdropFilter="blur(10px)" boxShadow="md">
            <Icon
              as={icon}
              w={8}
              h={8}
              bgGradient={gradient}
              sx={{
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            />
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
}

export default function Dashboard() {
  const [totalDownloaded, setTotalDownloaded] = useState(0);
  const [iosDownloads, setIosDownloads] = useState(0);
  const [androidDownloads, setAndroidDownloads] = useState(0);
  const [totalReleases, setTotalReleases] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/tracking/all');
      const data = (await response.json()) as AllTrackingResponse;

      setTotalDownloaded(data.trackings.reduce((acc, curr) => acc + curr.count, 0));

      const iosData = data.trackings.filter((metric: TrackingMetrics) => metric.platform === 'ios');
      const androidData = data.trackings.filter(
        (metric: TrackingMetrics) => metric.platform === 'android'
      );

      setIosDownloads(iosData.reduce((acc, curr) => acc + curr.count, 0));
      setAndroidDownloads(androidData.reduce((acc, curr) => acc + curr.count, 0));
      setTotalReleases(data.totalReleases);
    } catch (error) {
      console.error('Failed to fetch tracking data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const stats = [
    {
      title: 'Total Releases',
      value: totalReleases,
      icon: FaRocket,
      gradient: 'linear(to-r, primary.400, brand.500)',
      helpText: 'Active OTA releases',
    },
    {
      title: 'Total Downloads',
      value: totalDownloaded,
      icon: FaDownload,
      gradient: 'linear(to-r, brand.400, accent.500)',
      helpText: 'All platforms combined',
    },
    {
      title: 'iOS Downloads',
      value: iosDownloads,
      icon: FaApple,
      gradient: 'linear(to-r, gray.600, gray.800)',
      helpText: 'Apple devices',
    },
    {
      title: 'Android Downloads',
      value: androidDownloads,
      icon: FaAndroid,
      gradient: 'linear(to-r, green.400, green.600)',
      helpText: 'Android devices',
    },
  ];

  return (
    <ProtectedRoute>
      <Layout>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading
              size="2xl"
              mb={2}
              bgGradient="linear(to-r, primary.400, brand.500)"
              bgClip="text">
              Dashboard
            </Heading>
            <Text color={useColorModeValue('gray.600', 'gray.400')}>
              Monitor your OTA server performance and statistics
            </Text>
          </Box>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </SimpleGrid>

          {/* Additional Info Card */}
          <Card
            bg={useColorModeValue('whiteAlpha.900', 'dark.800')}
            borderRadius="2xl"
            overflow="hidden">
            <CardHeader bgGradient="linear(to-r, primary.500, brand.500)" color="white" py={4}>
              <Heading size="md">Quick Stats</Heading>
            </CardHeader>
            <CardBody p={6}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <VStack align="start" spacing={2}>
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color={useColorModeValue('gray.600', 'gray.400')}>
                    Platform Distribution
                  </Text>
                  <HStack spacing={4}>
                    <Box>
                      <Text fontSize="2xl" fontWeight="700">
                        {totalDownloaded > 0
                          ? Math.round((iosDownloads / totalDownloaded) * 100)
                          : 0}
                        %
                      </Text>
                      <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.500')}>
                        iOS
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="2xl" fontWeight="700">
                        {totalDownloaded > 0
                          ? Math.round((androidDownloads / totalDownloaded) * 100)
                          : 0}
                        %
                      </Text>
                      <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.500')}>
                        Android
                      </Text>
                    </Box>
                  </HStack>
                </VStack>

                <VStack align="start" spacing={2}>
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color={useColorModeValue('gray.600', 'gray.400')}>
                    Average Downloads
                  </Text>
                  <Text fontSize="2xl" fontWeight="700">
                    {totalReleases > 0 ? Math.round(totalDownloaded / totalReleases) : 0}
                  </Text>
                  <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.500')}>
                    Per release
                  </Text>
                </VStack>

                <VStack align="start" spacing={2}>
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color={useColorModeValue('gray.600', 'gray.400')}>
                    Status
                  </Text>
                  <HStack>
                    <Box w={3} h={3} borderRadius="full" bg="green.400" />
                    <Text fontSize="sm" fontWeight="600" color="green.400">
                      All Systems Operational
                    </Text>
                  </HStack>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </Card>
        </VStack>
      </Layout>
    </ProtectedRoute>
  );
}
