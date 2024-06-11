import { Fragment, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { publicRoutes, privateRoutes } from './routes';
import DefaultLayout from './layouts/DefaultLayout';
import './App.css';
import { Provider } from 'react-redux';
import store from './redux/store';

function App() {
    return (
        <div className="App">
            <Provider store={store}>
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = DefaultLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </Provider>
        </div>
    );
}

export default App;
