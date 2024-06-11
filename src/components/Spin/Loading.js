import { Spin } from 'antd';
const Loading = ({ isShow }) => {
    if (isShow)
        return (
            <div
                style={{
                    zIndex: '2',
                }}
            >
                <Spin tip="Loading..." size="large"></Spin>
            </div>
        );
};

export default Loading;
