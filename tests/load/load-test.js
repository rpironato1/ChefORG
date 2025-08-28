import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp-up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp-up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 500 }, // Ramp-up to 500 users
    { duration: '5m', target: 500 }, // Stay at 500 users
    { duration: '2m', target: 1000 }, // Ramp-up to 1000 users
    { duration: '5m', target: 1000 }, // Stay at 1000 users (target)
    { duration: '2m', target: 0 }, // Ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.1'], // Less than 10% error rate
    errors: ['rate<0.1'], // Less than 10% error rate
  },
};

const BASE_URL = 'http://localhost:8110';

// Test scenarios
const scenarios = [
  { name: 'Home Page', path: '/', weight: 30 },
  { name: 'Menu Browse', path: '/menu', weight: 25 },
  { name: 'Reservation', path: '/reservas', weight: 20 },
  { name: 'Admin Login', path: '/admin', weight: 15 },
  { name: 'Admin Dashboard', path: '/admin/dashboard', weight: 10 },
];

export default function () {
  // Select random scenario based on weight
  const random = Math.random() * 100;
  let cumulativeWeight = 0;
  let selectedScenario = scenarios[0];

  for (const scenario of scenarios) {
    cumulativeWeight += scenario.weight;
    if (random <= cumulativeWeight) {
      selectedScenario = scenario;
      break;
    }
  }

  // Make request
  const response = http.get(`${BASE_URL}${selectedScenario.path}`, {
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      'User-Agent': 'ChefORG-LoadTest/1.0',
    },
  });

  // Check response
  const success = check(response, {
    'status is 200': r => r.status === 200,
    'response time < 500ms': r => r.timings.duration < 500,
    'page loads correctly': r => r.body.includes('ChefORG') || r.body.includes('html'),
  });

  // Track errors
  errorRate.add(!success);

  // Think time (simulate user behavior)
  sleep(Math.random() * 3 + 1); // 1-4 seconds
}

// Setup function
export function setup() {
  console.log('🔥 Starting ChefORG Load Test');
  console.log('Target: 1000+ concurrent users');
  console.log('Duration: ~30 minutes');

  // Warm-up request
  const response = http.get(BASE_URL);
  if (response.status !== 200) {
    throw new Error(`Server not ready: ${response.status}`);
  }

  return { baseUrl: BASE_URL };
}

// Teardown function
export function teardown(data) {
  console.log('🏁 Load test completed');
  console.log(`Base URL tested: ${data.baseUrl}`);
}
