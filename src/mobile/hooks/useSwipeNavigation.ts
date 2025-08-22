import { useSwipeable } from 'react-swipeable';
import { useNavigate } from 'react-router-dom';

interface SwipeNavigationConfig {
  enableSwipeNavigation?: boolean;
  routes?: {
    left?: string;
    right?: string;
  };
}

export const useSwipeNavigation = (config: SwipeNavigationConfig = {}) => {
  const navigate = useNavigate();
  const { enableSwipeNavigation = true, routes } = config;

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (enableSwipeNavigation && routes?.left) {
        navigate(routes.left);
      }
    },
    onSwipedRight: () => {
      if (enableSwipeNavigation && routes?.right) {
        navigate(routes.right);
      }
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50, // Minimum distance for swipe
    preventScrollOnSwipe: false,
    rotationAngle: 0,
  });

  return swipeHandlers;
};