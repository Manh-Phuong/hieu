import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { Input, Button, message, Select, Space, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';

import * as ApiService from '../../services/apiService';
import Highlighter from 'react-highlight-words';

import LoadingFullScreen from '../../components/Spin/LoadingFullScreen';
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LabelList,
    ResponsiveContainer,
    PieChart,
    Pie,
    LineChart,
    Line,
} from 'recharts';

import BoxPlotChart from '../../components/Chart/BoxPlotChart';
import { v4 as uuidv4 } from 'uuid';
import { address, transactions } from '../../utils/constant';

const cx = classNames.bind(styles);

function Home() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // const { isPC, isTablet, isMobile } = useContext(ResponsiveContext);

    const [selectTag, setSelectTag] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [dataRegion, setDataRegion] = useState([]);
    const [dataTransactions, setDataTransactions] = useState([]);

    const [regionCount, setRegionCount] = useState([]);
    const [transactionTime, setTransactionTime] = useState([]);
    const [transactionMean, setTransactionMean] = useState([]);
    const [select, setSelect] = useState('jp_kr_cn');

    useEffect(() => {
        const countRegions = dataRegion.reduce((acc, item) => {
            acc[item.regional] = (acc[item.regional] || 0) + 1;
            return acc;
        }, {});

        const formattedData = Object.entries(countRegions).map(([regional, count]) => ({
            regional,
            count,
        }));

        setRegionCount(formattedData);
    }, [dataRegion]);

    useEffect(() => {
        const transformedData = Array.from({ length: 24 }, (_, hour) => ({
            hour,
            transactions: dataTransactions[select]?.transactions[hour],
        }));

        setTransactionTime(transformedData);
        console.log('dataTransactions', dataTransactions);
    }, [dataTransactions, select]);

    useEffect(() => {
        const regionMeans = Object.keys(dataTransactions)?.map((region) => ({
            x: region,
            y: dataTransactions[region]?.means,
        }));
        setTransactionMean(regionMeans);
    }, [dataTransactions]);

    const fetchApi = async (data) => {
        setLoading(true);

        try {
            const resultAddress = await ApiService.getAddress(data);
            const resultTransactions = await ApiService.getAddress(data);

            if (resultAddress?.statusCode === 200) {
                setDataRegion(resultAddress?.data);
                setDataSource(
                    resultAddress?.data?.map((data, index) => {
                        return {
                            key: uuidv4(),
                            stt: `${index + 1}`,
                            address: data?.address,
                            regional: data?.regional,
                        };
                    }),
                );
            } else {
                message.error(resultAddress?.statusText);
            }

            if (resultTransactions?.statusCode === 200) {
                setDataTransactions(resultTransactions?.data);
            } else {
                message.error(resultTransactions?.statusText);
            }
        } catch (error) {
            console.log('fetchApi Home.js ApiService getAddress' + error);
        }
        setLoading(false);
    };

    const handleSelect = (value) => {
        setSelectTag([...selectTag, value]);
    };

    const handleAdd = () => {
        setSelectTag([]);
        const newData = selectTag?.map((tag, index) => {
            return {
                key: uuidv4(),
                email: tag,
            };
        });

        setDataSource([...newData]);

        const data = newData?.map((data) => data?.email);

        fetchApi(data);
    };

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: '5%',
            // ...getColumnSearchProps('stt'),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: '40%',
            ...getColumnSearchProps('address'),
        },
        {
            title: 'Regional',
            dataIndex: 'regional',
            key: 'regional',
            width: '10%',
            ...getColumnSearchProps('regional'),
        },
    ];

    const getColor = (regional) => {
        switch (regional) {
            case 'jp_kr_cn':
                return '#fba200';
            case 'africa':
                return '#e62601';
            case 'europe':
                return '#0281c8';
            case 'america':
                return '#07a398';
            case 'southeast_asia':
                return '#90c221';
            default:
                return '#8884d8';
        }
    };

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = outerRadius + 10;
        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

        const label = `${regionCount[index].regional}: ${percent}%`;

        // Tính toán tọa độ của đầu đường kẻ
        const startX = cx + (outerRadius + 5) * Math.cos(-midAngle * (Math.PI / 180));
        const startY = cy + (outerRadius + 5) * Math.sin(-midAngle * (Math.PI / 180));

        return (
            <>
                <line x1={startX} y1={startY} x2={x} y2={y} stroke="gray" strokeWidth="1" />
                <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                    {label}
                </text>
            </>
        );
    };

    const onChange = (value) => {
        setSelect(value);
    };
    const onSearch = (value) => {
        console.log('search:', value);
    };

    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <>
            <div>
                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <LoadingFullScreen isShow={loading} />
                    </div>
                )}
                <div className={cx('wrap')}>
                    <div className={cx('region')}>
                        <div className={cx('title')}>
                            {/* Distributed in each region */}1 - DISTRIBUTED IN EACH REGION
                        </div>
                        <div className={cx('region-body')}>
                            <div>
                                <div>
                                    <Select
                                        mode="tags"
                                        style={{
                                            width: '61%',
                                        }}
                                        value={selectTag}
                                        // onChange={handleChange}
                                        onSelect={handleSelect}
                                        tokenSeparators={[',']}
                                        // options={options}
                                    />

                                    <Button
                                        onClick={handleAdd}
                                        type="primary"
                                        style={{
                                            marginBottom: 16,
                                            marginLeft: '1vw',
                                        }}
                                    >
                                        Search
                                    </Button>
                                </div>
                                <div>
                                    {dataSource?.length > 0 && <Table columns={columns} dataSource={dataSource} />}
                                </div>
                            </div>
                            <div style={{ marginTop: '32px' }}>
                                {dataRegion?.length > 0 && (
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                        <BarChart
                                            width={600} // Tăng kích thước chiều rộng của biểu đồ
                                            height={400} // Tăng kích thước chiều cao của biểu đồ
                                            data={regionCount}
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 20,
                                                bottom: 80, // Tăng khoảng cách bên dưới để đủ chỗ cho các nhãn
                                            }}
                                            barCategoryGap="20%" // Điều chỉnh khoảng cách giữa các cột
                                            barGap={5} // Điều chỉnh khoảng cách giữa các thanh
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            {/* <XAxis dataKey="regional" interval={0} textAnchor="end" /> */}
                                            <XAxis
                                                dataKey="regional"
                                                interval={0}
                                                angle={0}
                                                textAnchor="middle"
                                                tick={{ dy: 10 }} // Điều chỉnh vị trí của nhãn
                                            />
                                            {/* <XAxis dataKey="regional" /> */}
                                            <YAxis />
                                            <Tooltip />
                                            {/* <Legend /> */}
                                            <Bar dataKey="count" fill="#8884d8" minPointSize={5}>
                                                {regionCount.map((entry) => (
                                                    <Cell key={entry.regional} fill={getColor(entry.regional)} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </div>
                                )}

                                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <PieChart width={600} height={500}>
                                        <Pie
                                            data={regionCount}
                                            dataKey="count"
                                            nameKey="regional"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={150}
                                            fill="#8884d8"
                                            // label
                                            label={renderCustomLabel}
                                        >
                                            {regionCount.map((entry) => (
                                                <Cell key={entry.regional} fill={getColor(entry.regional)} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cx('transactions')}>
                        <div className={cx('title')}>2 - DISTRIBUTED OF TRANSACTIONS TIME</div>
                        <div className={cx('transactions-body')}>
                            <div
                                style={{
                                    marginBottom: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '32px',
                                    justifyContent: 'center',
                                }}
                            >
                                <div>Select region:</div>
                                <Select
                                    showSearch
                                    placeholder="Select a person"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onSearch={onSearch}
                                    filterOption={filterOption}
                                    value={select}
                                    // labelInValue
                                    options={[
                                        {
                                            value: 'jp_kr_cn',
                                            label: 'jp_kr_cn',
                                        },
                                        {
                                            value: 'africa',
                                            label: 'africa',
                                        },
                                        {
                                            value: 'europe',
                                            label: 'europe',
                                        },
                                        {
                                            value: 'america',
                                            label: 'america',
                                        },
                                        {
                                            value: 'southeast_asia',
                                            label: 'southeast_asia',
                                        },
                                    ]}
                                    style={{ minWidth: '160px' }}
                                />
                            </div>
                            <div>
                                <BarChart
                                    width={1200}
                                    height={600}
                                    data={transactionTime}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 80,
                                    }}
                                    barCategoryGap="20%"
                                    barGap={5}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis
                                        dataKey="hour"
                                        interval={0}
                                        angle={0}
                                        textAnchor="middle"
                                        tick={{ dy: 10 }}
                                        label={{ value: 'hour', position: 'insideBottom', offset: -25 }}
                                    />
                                    <YAxis
                                        label={{
                                            value: 'transaction number',
                                            angle: -90,
                                            position: 'insideLeft',
                                            dy: -10,
                                        }}
                                    />
                                    <Tooltip />
                                    <Bar dataKey="transactions" fill="#8884d8" minPointSize={5}></Bar>
                                </BarChart>
                            </div>
                        </div>
                    </div>

                    <div className={cx('transactions')}>
                        <div className={cx('title')}>3 - DISTRIBUTED OF MEAN TRANSACTIONS</div>
                        <div className={cx('transactions-body')}>
                            <div>{transactionMean?.length > 0 && <BoxPlotChart data={transactionMean} />}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
