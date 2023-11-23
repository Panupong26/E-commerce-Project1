import axios from "../../config/Axios";
import { useEffect, useState } from "react"
import '../../CSS-file/component-css/seller-dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightLong, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FONTEND_URL } from "../../env";
import { handleErr } from "../../handle-err/HandleErr";

function ShopDashboard() {
    const [staticData, setStaticData] = useState();
    const [staticShow, setStaticShow] = useState();
    const [productShow, setProductShow] = useState();
    const [quantity, setQuantity] = useState();
    const [totalQuantity, setTotalQuantity] = useState();
    const [income, setIncome] = useState();
    const [totalIncome, setTotalIncome] = useState();
    const [date, setDate] = useState();
    const [defaultDate, setDefaultDate] = useState();
    const [chartFilter, setChartFilter] = useState('day');
    const [dateMax, setDateMax] = useState();
    const [dateMin, setDateMin] = useState();
    const [filterButtonDis, setFilterButtonDis] = useState({
        day: 'none',
        month: '',
        year: ''
    })
    const [filterActiveButtonDis, setFilterActiveButtonDis] = useState({
        day: '',
        month: 'none',
        year: 'none'
    })
    const [totalStaticBoxMaxHeight, setTotalStaticBoxMaxHeight] = useState();
    const [productStickMaxWidth, setProductStickMaxWidth] = useState();


    function clearActiveButton() {
        setFilterButtonDis({
            day: '',
            month: '',
            year: ''
        });

        setFilterActiveButtonDis({
            day: 'none',
            month: 'none',
            year: 'none'
        });
    }



    async function getOrderData() {
        await axios.get(`/order/getorderbysellerid`)
        .then(res => {
            const receivedOrders = res.data.filter(e => e.status === 'RECEIVED');
            setStaticData([...receivedOrders]);
        })
        .catch(err => {
           handleErr(err);
        })
    }

    function getDefaultDate() {
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        if(`${day}`.length > 1) {
            if(`${month}`.length > 1) {
                let resultMax = +`${year}${month}${day}`;
                let resultMin = +`${year}${month}01`;
                setDateMax(resultMax);
                setDateMin(resultMin);
            } else {
                let resultMax = +`${year}0${month}${day}`;
                let resultMin = +`${year}0${month}01`;
                setDateMax(resultMax);
                setDateMin(resultMin);
            }
        } else {
            if(`${month}`.length > 1) {
                let resultMax = +`${year}${month}0${day}`;
                let resultMin = +`${year}${month}01`;
                setDateMax(resultMax);
                setDateMin(resultMin);
            } else {
                let resultMax = +`${year}0${month}0${day}`;
                let resultMin = +`${year}0${month}01`;
                setDateMax(resultMax);
                setDateMin(resultMin);
            }
        }
    };


    function getDayChart() {
        let data = {};
        let i = dateMin;
    
        while (i <= dateMax) {
            data[i] = {
                quantity: 0,
                income: 0
            };


            let date = new Date(+(`${i}`.slice(0, 4)), +(`${i}`.slice(4, 6)) - 1, +(`${i}`.slice(6, 8)));
            date.setDate(date.getDate() + 1);
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            if(`${day}`.length > 1) {
                if(`${month}`.length > 1) {
                    i = +(`${year}${month}${day}`);
                } else {
                    i = +(`${year}0${month}${day}`);
                }
            } else {
                if(`${month}`.length > 1) {
                    i = +(`${year}${month}0${day}`);
                } else {
                    i = +(`${year}0${month}0${day}`);
                }
            };
        };


        let dataFiltered = staticData.filter(e => {
            if(`${e.date}`.length > 1) {
                if(`${e.month}`.length > 1) {
                    if(+(`${e.year}${e.month}${e.date}`) <= dateMax && +(`${e.year}${e.month}${e.date}`) >= dateMin) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if(+(`${e.year}0${e.month}${e.date}`) <= dateMax && +(`${e.year}0${e.month}${e.date}`) >= dateMin) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                if(`${e.month}`.length > 1) {
                    if(+(`${e.year}${e.month}0${e.date}`) <= dateMax && +(`${e.year}${e.month}0${e.date}`) >= dateMin) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if(+(`${e.year}0${e.month}0${e.date}`) <= dateMax && +(`${e.year}0${e.month}0${e.date}`) >= dateMin) {
                        return true;
                    } else {
                        return false;
                    }
                }
            };
        });


        dataFiltered.forEach(e => {
            if(`${e.date}`.length > 1) {
                if(`${e.month}`.length > 1) {
                    data[`${e.year}${e.month}${e.date}`] = {
                        quantity: data[`${e.year}${e.month}${e.date}`].quantity + e.quantity,
                        income: data[`${e.year}${e.month}${e.date}`].income + e.totalPrice  
                    };    
                } else {
                    data[`${e.year}0${e.month}${e.date}`] = {
                        quantity: data[`${e.year}0${e.month}${e.date}`].quantity + e.quantity,
                        income: data[`${e.year}0${e.month}${e.date}`].income + e.totalPrice
                    };
                };
            } else {
                if(`${e.month}`.length > 1) {
                    data[`${e.year}${e.month}0${e.date}`] = {
                        quantity: data[`${e.year}${e.month}0${e.date}`].quantity + e.quantity,
                        income: data[`${e.year}${e.month}0${e.date}`].income + e.totalPrice  
                    };    
                } else {
                    data[`${e.year}0${e.month}0${e.date}`] = {
                        quantity: data[`${e.year}0${e.month}0${e.date}`].quantity + e.quantity,
                        income: data[`${e.year}0${e.month}0${e.date}`].income + e.totalPrice
                    };
                };
            };
        });

        let dataShow = [];

        for(let keys in data) {
            let preData = {};
            preData.date = +keys;
            preData.quantity = data[keys].quantity;
            preData.income = data[keys].income;
            dataShow.push(preData);
        };

        dataShow.sort((a, b) => {
            return a.date - b.date
        });

        setStaticShow([...dataShow]);

        let productData = {};
        dataFiltered.forEach(e => {
            if(productData[e.productName + '(' + e.productOption + ')']) {
                productData[e.productName + '(' + e.productOption + ')'] = {
                    quantity: productData[e.productName + '(' + e.productOption + ')'].quantity + e.quantity,
                    income: productData[e.productName + '(' + e.productOption + ')'].income + e.totalPrice,
                    picture: e.orderPicture,
                    productId: e.productId
                };
            } else {
                productData[e.productName + '(' + e.productOption + ')'] = {
                    quantity: e.quantity,
                    income: e.totalPrice,
                    picture: e.orderPicture,
                    productId: e.productId
                };
            };
        });
        

        let product = [];

        for(let keys in productData) {
            let preProduct = {};
            preProduct.product = keys;
            preProduct.quantity = productData[keys].quantity;
            preProduct.income = productData[keys].income;
            preProduct.picture = productData[keys].picture;
            preProduct.productId = productData[keys].productId;

            product.push(preProduct);
        }

        product.sort((a, b) => b.quantity - a.quantity);

        setProductShow([...product]);
    };

    function getMonthChart() {
        let data = {};
        let i = +(`${dateMin}`.slice(0, 6));
        while (i <= +(`${dateMax}`.slice(0, 6))) {
            data[i] = {
                quantity: 0,
                income: 0
            };

            let date = new Date(+(`${i}`.slice(0, 4)), +(`${i}`.slice(4, 6)) - 1, +(`${dateMin}`.slice(6, 8)));
            date.setMonth(date.getMonth() + 1);
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            if(`${month}`.length > 1) {
                i = +`${year}${month}`;
            } else {
                i = +`${year}0${month}`;
            }  
        };

        let dataShow = [];
        let dataFiltered = staticData.filter(e => {
            if(`${e.date}`.length > 1) {
                if(`${e.month}`.length > 1) {
                    if(+(`${e.year}${e.month}${e.date}`) <= dateMax && +(`${e.year}${e.month}${e.date}`) >= dateMin) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if(+(`${e.year}0${e.month}${e.date}`) <= dateMax && +(`${e.year}0${e.month}${e.date}`) >= dateMin) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                if(`${e.month}`.length > 1) {
                    if(+(`${e.year}${e.month}0${e.date}`) <= dateMax && +(`${e.year}${e.month}0${e.date}`) >= dateMin) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if(+(`${e.year}0${e.month}0${e.date}`) <= dateMax && +(`${e.year}0${e.month}0${e.date}`) >= dateMin) {
                        return true;
                    } else {
                        return false;
                    }
                }
            };
        });


        dataFiltered.forEach(e => {
            if(`${e.month}`.length > 1) {
                data[`${e.year}${e.month}`] = {
                    quantity: data[`${e.year}${e.month}`].quantity + e.quantity,
                    income: data[`${e.year}${e.month}`].income + e.totalPrice  
                };    
            } else {
                data[`${e.year}0${e.month}`] = {
                    quantity: data[`${e.year}0${e.month}`].quantity + e.quantity,
                    income: data[`${e.year}0${e.month}`].income + e.totalPrice
                };
            };    
        });

        for(let keys in data) {
            let preData = {};
            preData.date = +keys;
            preData.quantity = data[keys].quantity;
            preData.income = data[keys].income;
            dataShow.push(preData);
        };

        dataShow.sort((a, b) => {
            return a.date - b.date
        });

        setStaticShow([...dataShow]);

        let productData = {};
        dataFiltered.forEach(e => {
            if(productData[e.productName + '(' + e.productOption + ')']) {
                productData[e.productName + '(' + e.productOption + ')'] = {
                    quantity: productData[e.productName + '(' + e.productOption + ')'].quantity + e.quantity,
                    income: productData[e.productName + '(' + e.productOption + ')'].income + e.totalPrice,
                    picture: e.orderPicture,
                    productId: e.productId
                };
            } else {
                productData[e.productName + '(' + e.productOption + ')'] = {
                    quantity: e.quantity,
                    income: e.totalPrice,
                    picture: e.orderPicture,
                    productId: e.productId
                };
            };
        });

        let product = [];

        for(let keys in productData) {
            let preProduct = {};
            preProduct.product = keys;
            preProduct.quantity = productData[keys].quantity;
            preProduct.income = productData[keys].income;
            preProduct.picture = productData[keys].picture;
            preProduct.productId = productData[keys].productId;

            product.push(preProduct);
        }

        product.sort((a, b) => b.quantity - a.quantity);

        setProductShow([...product]);
    };

    function getYearChart() {
        let data = {};
        let i = +(`${dateMin}`.slice(0, 4));
        while (i <= +(`${dateMax}`.slice(0, 4))) {
            data[i] = {
                quantity: 0,
                income: 0
            };

            let date = new Date(+(`${i}`.slice(0, 4)), +(`${dateMin}`.slice(4, 6)) - 1, +(`${dateMin}`.slice(6, 8)));
            date.setFullYear(date.getFullYear() + 1);
            let year = date.getFullYear();
        
            i = year;
        };

        let dataShow = [];
        let dataFiltered = staticData.filter(e => {
            if(`${e.date}`.length > 1) {
                if(`${e.month}`.length > 1) {
                    if(+(`${e.year}${e.month}${e.date}`) <= dateMax && +(`${e.year}${e.month}${e.date}`) >= dateMin) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if(+(`${e.year}0${e.month}${e.date}`) <= dateMax && +(`${e.year}0${e.month}${e.date}`) >= dateMin) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                if(`${e.month}`.length > 1) {
                    if(+(`${e.year}${e.month}0${e.date}`) <= dateMax && +(`${e.year}${e.month}0${e.date}`) >= dateMin) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if(+(`${e.year}0${e.month}0${e.date}`) <= dateMax && +(`${e.year}0${e.month}0${e.date}`) >= dateMin) {
                        return true;
                    } else {
                        return false;
                    }
                }
            };
        });


        dataFiltered.forEach(e => {
            data[e.year] = {
                quantity: data[e.year].quantity + e.quantity,
                income: data[e.year].income + e.totalPrice  
            };       
        });

        for(let keys in data) {
            let preData = {};
            preData.date = +keys;
            preData.quantity = data[keys].quantity;
            preData.income = data[keys].income;
            dataShow.push(preData);
        };

        dataShow.sort((a, b) => {
            return a.date - b.date
        });

        setStaticShow([...dataShow]);

        let productData = {};
        dataFiltered.forEach(e => {
            if(productData[e.productName + '(' + e.productOption + ')']) {
                productData[e.productName + '(' + e.productOption + ')'] = {
                    quantity: productData[e.productName + '(' + e.productOption + ')'].quantity + e.quantity,
                    income: productData[e.productName + '(' + e.productOption + ')'].income + e.totalPrice,
                    picture: e.orderPicture,
                    productId: e.productId
                };
            } else {
                productData[e.productName + '(' + e.productOption + ')'] = {
                    quantity: e.quantity,
                    income: e.totalPrice,
                    picture: e.orderPicture,
                    productId: e.productId
                };
            };
        });

        let product = [];

        for(let keys in productData) {
            let preProduct = {};
            preProduct.product = keys;
            preProduct.quantity = productData[keys].quantity;
            preProduct.income = productData[keys].income;
            preProduct.picture = productData[keys].picture;
            preProduct.productId = productData[keys].productId;

            product.push(preProduct);
        }

        product.sort((a, b) => b.quantity - a.quantity);

        setProductShow([...product]);
    };

    function handleHoverStick(e) {
        setQuantity(e.quantity);
        setIncome(e.income);
        if(chartFilter === 'day') {
            setDate(`${e.date}`.slice(6, 8) + '/' + `${e.date}`.slice(4, 6) + '/' + `${e.date}`.slice(0, 4));
        } else if(chartFilter === 'month') {
            setDate(`${e.date}`.slice(4, 6) + '/' + `${e.date}`.slice(0, 4));
        } else if(chartFilter === 'year') {
            setDate(`${e.date}`.slice(0, 4));
        };
    }

    function handleLeaveStick() {
        setDate(defaultDate);
        setQuantity(totalQuantity);
        setIncome(totalIncome);
    }

    useEffect(() => {
        document.title = 'Store Dashboard';
        getOrderData();
        getDefaultDate();
    }, []);

    useEffect(() => {
        if(chartFilter && staticData && dateMin && dateMax) {
            if(chartFilter === 'day') {
                getDayChart();
            } else if(chartFilter === 'month') {
                getMonthChart();
            } else if(chartFilter === 'year') {
                getYearChart();
            }; 
            
            let min = `${dateMin}`.slice(6, 8) + '/' + `${dateMin}`.slice(4, 6) + '/' + `${dateMin}`.slice(0, 4) ;
            let max = `${dateMax}`.slice(6, 8) + '/' + `${dateMax}`.slice(4, 6) + '/' + `${dateMax}`.slice(0, 4) ;
            setDate(min + ' - ' + max);
            setDefaultDate(min + ' - ' + max);
        };

        // eslint-disable-next-line
    }, [chartFilter, staticData, dateMin, dateMax])

    useEffect(() => {
        if(staticShow && staticShow[0]) {
            let data = [...staticShow];
            data.sort((a, b) => a.quantity - b.quantity);
            let maxHeight = data[data.length - 1].quantity;
            setTotalStaticBoxMaxHeight(maxHeight);

            let preQuantity = 0;
            let preIncome = 0;
            data.forEach(e => {
                preQuantity += e.quantity;
                preIncome += e.income;
            });

            setQuantity(preQuantity);
            setIncome(preIncome);
            setTotalQuantity(preQuantity);
            setTotalIncome(preIncome);
        };
    }, [staticShow]);

    useEffect(() => {
        if(productShow && productShow[0]) {
            let data = [...productShow];
            data.sort((a, b) => a.quantity - b.quantity);
            let maxWidth = data[data.length - 1].quantity
            setProductStickMaxWidth(maxWidth);
        };
    }, [productShow]);

 


    
    return <>
        <div>
            <div className="dashboardPageFilterBox">
                <div className="filterButton" style={{display: filterButtonDis?.day}} onClick = {() => {
                    clearActiveButton()
                    setFilterButtonDis(prev => {return{...prev, day: 'none'}});
                    setFilterActiveButtonDis(prev => {return{...prev, day: ''}});
                    setChartFilter('day');
                }}>Day</div>
                <div className="filterActiveButton" style={{display: filterActiveButtonDis?.day}} >Day</div>
                <div className="filterButton" style={{display: filterButtonDis?.month}} onClick = {() => {
                    clearActiveButton()
                    setFilterButtonDis(prev => {return{...prev, month: 'none'}});
                    setFilterActiveButtonDis(prev => {return{...prev, month: ''}});
                    setChartFilter('month');
                }}>Month</div>
                <div className="filterActiveButton" style={{display: filterActiveButtonDis?.month}} >Month</div>
                <div className="filterButton" style={{display: filterButtonDis?.year}} onClick = {() => {
                    clearActiveButton()
                    setFilterButtonDis(prev => {return{...prev, year: 'none'}});
                    setFilterActiveButtonDis(prev => {return{...prev, year: ''}});
                    setChartFilter('year');
                }}>Year</div>
                <div className="filterActiveButton" style={{display: filterActiveButtonDis?.year}} >Year</div>
            </div>
            <div className="dateFilterBox">
                <input type={'date'} onChange = {e => {
                    let value = e.target.value.replaceAll('-', '');
                    if(value) {
                        setDateMin(value);
                    } else {
                        const date = new Date();
                        let month = date.getMonth() + 1;
                        let year = date.getFullYear();
                        if(`${month}`.length > 1) {
                            let resultMin = +`${year}${month}01`;
                            setDateMin(resultMin);
                        } else {
                            let resultMin = +`${year}0${month}01`;
                            setDateMin(resultMin);
                        };    
                    };
                }}/>
                <FontAwesomeIcon icon={faRightLong} />
                <input type={'date'} onChange = {e => {
                    let value = e.target.value.replaceAll('-', '');
                    if(value) {
                        setDateMax(value);
                    } else {
                        const date = new Date();
                        let day = date.getDate();
                        let month = date.getMonth() + 1;
                        let year = date.getFullYear();
                        if(`${day}`.length > 1) {
                            if(`${month}`.length > 1) {
                                let resultMax = +`${year}${month}${day}`;
                                setDateMax(resultMax);   
                            } else {
                                let resultMax = +`${year}0${month}${day}`;
                                setDateMax(resultMax);    
                            }
                        } else {
                            let resultMax = +`${year}0${month}0${day}`;
                            setDateMax(resultMax);   
                        }; 
                    };
                }}/>
            </div>
            <div className="chartBox">
                <div>
                    <div className="totalStaticBox">
                        {staticShow?.map(e => <div key={e.date} className="stick" style={{height: e.quantity === 0 ? '1px' : `${((e.quantity/totalStaticBoxMaxHeight)*100)}%` }} 
                        onMouseOver = {() => handleHoverStick(e)}
                        onMouseLeave = {handleLeaveStick}></div>)}
                    </div>
                    <div className="totalValueBox">
                        <div><FontAwesomeIcon icon={faCalendar} /> &nbsp;{date}</div>
                        <div> Quantity: {quantity?.toLocaleString()}</div>
                        <div> Income: {income?.toLocaleString('th-TH', {style: 'currency', currency: 'THB'})}</div>
                    </div>
                </div>
                <div className="productStaticBox">
                    {productShow?.map(e => 
                        <div key={new Date().getTime() + Math.random()} className="productStickBox" style={{width: `${((e.quantity/productStickMaxWidth)*100) - 10}%`}} onClick = {() => window.location.href = `${FONTEND_URL}/product/${e.productId}`}>
                            <div>
                                <img src = {e.picture} alt = 'productPic'/>
                                <div className="product">{e?.product.length > 30 ? e.product.slice(0,29) + '...' : e.product}</div>
                            </div>
                            <div>
                                <div className="stickQuantity">quantity {e.quantity.toLocaleString()}</div>
                                <div className="stickIncome">{e.income.toLocaleString('th-TH', {style: 'currency', currency: 'THB'})}</div>
                            </div>
                        </div>    
                    )}
                </div>
            </div>
        </div>
    </>
    
}

export default ShopDashboard