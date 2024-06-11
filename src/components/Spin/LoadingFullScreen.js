import { Spin } from 'antd';
const LoadingFullScreen = ({ isShow, tip = 'Loading...' }) => {
    if (isShow)
        return (
            <div
                style={{
                    zIndex: '2',
                }}
            >
                <Spin tip={tip} size="large" fullscreen></Spin>
            </div>
        );
};

export default LoadingFullScreen;
