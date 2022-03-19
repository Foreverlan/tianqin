window.onload = function () {
    let timer = null;
    let counts = 0;
    let $bannerBox = document.getElementById('js-banner_box');
    let $imgsBox = document.getElementById('js-banner_imgs_box');
    let $btnBox = document.getElementById('js-banner_btn_box');
    let $bannerBtns = document.querySelectorAll('[rel="banner_btn"]');
    let $bannerBack = document.getElementById('js-banner_back');
    let $bannerNext = document.getElementById('js-banner_next');
    let $navLink = document.querySelectorAll('[rel="nav"]');
    let $topNavLink = document.querySelectorAll('[rel="top_nav"]');
    
    let getChartDataFunc = url => {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(res=> {
                resolve(res.json())
            }).catch(err => {
                resolve({});
            })
        })
    }
    
    let initCharts = (obj, type) => {
        let map = {
            '1': document.getElementById('js-pie_chart'), // 饼状图
            '2': document.getElementById('js-vertical_chart'), // 竖状图
            '3': document.getElementById('js-month_chart'), // 月视图
        }
        
        let dom = map[type];
        dom && obj && echarts.init(dom).setOption(obj);
    }
    
    let formatData = (data, type) => {
        if (!(data.series && data.xAxis && data.xAxis.length && data.xAxis.length == data.series.length)) return false;
    
        let res = {};
        switch(type) {
            case '1': { // 饼状图
                let arr = [];
                data.series.forEach((item, index) => {
                    arr.push({
                        value: item,
                        name: data.xAxis[index],
                    })
                })
                res = {
                    title: {
                        text: '饼状图数据展示',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: [{
                        name: 'Access From',
                        type: 'pie',
                        radius: '50%',
                        data: arr,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                }
                break;
            }
            case '2': { // 竖状图
                res = {
                    title: {
                        text: '竖状图数据展示',
                        left: 'center'
                    },
                    xAxis: {
                        type: 'category',
                        data: data.xAxis
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: data.series,
                        type: 'bar',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(180, 180, 180, 0.2)'
                        }
                    }]
                }
                break;
            }
            case '3': {
                res = {
                    title: {
                        text: '曲线图数据展示',
                        left: 'center'
                    },
                    xAxis: {
                        type: 'category',
                        data: data.xAxis
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: data.series,
                        type: 'line',
                        smooth: true
                    }]
                }
                break;
            }
            default: {}
        }
    
        return res;
    }

    let setBannerInterval = () => {
        timer = setInterval(() => {
            counts++;

            changeBanner(counts);
        }, 3000)
    }

    let changeBanner = (num) => {
        let bannerLen = $bannerBtns.length;
        let index = ((num % bannerLen) + bannerLen) % bannerLen;
        $imgsBox.style.left = '-' + index * 560 + 'px';

        for (let i = 0; i < bannerLen; i++) {
            i == index ? $bannerBtns[i].setAttribute('class', 'focus') : $bannerBtns[i].removeAttribute('class', 'focus')
        }
    }
    
    setBannerInterval();

    $bannerBox.addEventListener('mouseenter', function () {
        timer && clearInterval(timer);

        return false;
    })

    $bannerBox.addEventListener('mouseleave', function () {
        setBannerInterval();

        return false;
    })
    
    if ($bannerBtns && $bannerBtns.length) {
        for(let i = 0; i < $bannerBtns.length; i++) {
            $bannerBtns[i].addEventListener('click', function () {
                changeBanner(i);

                return false;
            })
        }
    }

    $bannerNext.addEventListener('click', function() {
        counts++;
        changeBanner(counts);

        return false;
    })

    $bannerBack.addEventListener('click', function() {
        counts--;
        changeBanner(counts);

        return false;
    })

    if ($navLink && $navLink.length) {
        for(let i = 0; i < $navLink.length; i++) {
            $navLink[i].addEventListener('click', function () {
                for(let j = 0; j < $navLink.length; j++) {
                    $navLink[j].removeAttribute('class', 'focus');
                }
                $navLink[i].setAttribute('class', 'focus');
            })
        }
    }

    if ($topNavLink && $topNavLink.length) {
        for(let i = 0; i < $topNavLink.length; i++) {
            $topNavLink[i].addEventListener('click', function () {
                for(let j = 0; j < $topNavLink.length; j++) {
                    $topNavLink[j].removeAttribute('class', 'focus');
                }
                $topNavLink[i].setAttribute('class', 'focus');
            })
        }
    }



    getChartDataFunc('https://edu.telking.com/api/?type=month').then(res => {
        if (res && res.code == '200') {
            initCharts(formatData(res.data, '3'), '3');
        }
    })

    getChartDataFunc('https://edu.telking.com/api/?type=week').then(res => {
        if (res && res.code == '200') {
            initCharts(formatData(res.data, '1'), '1');
            initCharts(formatData(res.data, '2'), '2');
        }
    })
}