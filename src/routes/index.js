import routesConfig from '../config/routes';

import Home from '../pages/Home/Home';

const publicRoutes = [{ path: routesConfig.home, component: Home }];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
