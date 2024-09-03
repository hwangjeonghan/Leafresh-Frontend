let date = new Date();

const renderCalender = () => { // 달력을 보여주는 함수
    const viewYear = date.getFullYear();
    const viewMonth = date.getMonth();

    // 현재 연도와 월을 표시
    document.querySelector('.year-month').textContent =`${viewYear}년 ${viewMonth + 1}월`;

    // 지난달 마지막날과 이번달 마지막날

    // new Date 를 통해 오늘 날짜를 가져온다. 
    // 현재 연 월을 표시하는 viewYear 과 viewMonth를 통해 연과 월을 할당한다.
    // textContent 를 이용해서 0000년 0월과 같은 형태로 출력한다.

    const prevLast = new Date(viewYear, viewMonth, 0);
    const thisLast = new Date(viewYear, viewMonth+1,0);

    const PlDate = prevLast.getDate();
    const PLDay = prevLast.getDay();

    const TLDate = thisLast.getDate();
    const TLDay= thisLast.getDay(); 

    const prevDates = [];
    const thisDates = [...Array(TLDate+1).keys()].slice(1);
    const nextDates = [];

    console.log(thisDates)
    // 달력합치기
    if(PLDay !== 6) {
        for (let i = 0; i <PLDay + i; i++) {
            prevDates.unshift(PlDate -i);

        }
    }
    for ( let i = 1; i < 7 -TLDay; i++) {
        nextDates.push(i); // 다음달 날짜를 넣어줌.

    }

    const dates = prevDates.concat(thisDates, nextDates);

        // const thisDates = [...Array(TLDate + 1).keys()].slice(1) 에서 인덱스는 0부터 시작하므로 
        // TLDate에 +1 해주어 요소 하나가 추가된 배열을 만들고, slice(1) 을 이용해 1일부터 마지막날까지의 배열로 만든다.
        // 지난달 마지막 요일이 토요일이 아니면 (요일 시작이 일요일부터니까) 지난달 날짜들을 넣어준다
        // concat으로 지난달 이번달 다음달 배열을 합쳐준다.

    const firstDateIndex = dates.indexOf(1); // 이번달 1월의 인덱스 찾기
    const lastDateIndex = dates.lastIndexOf(TLDate); // 이번달 막날의 인덱스 찾기
    dates.forEach((date, i)=> {
        const condition = i >=firstDateIndex && i < lastDateIndex + 1 ? 'this' : 'other';
        dates[i] = `<div class="date"><span class=${condition}>${date}</span></div>`

    });
    document.querySelector('.dates').innerHTML = dates.join('');


    // 오늘 날짜 표시하기

    const today = new Date();

    if(viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
        for (let date of document.querySelectorAll('.this')){
            if(+date.innerText === today.getDate()) {
                date.classList.add('today');
                break;
            }
        }
    }


    renderCalender();
    const prevMonth = () => {
        date.setMonth(date.getMonth() -1);
        renderCalender();

    }

    const nextMonth = () => {
        date.setMonth(date.getMonth() +1);
        renderCalender();
    }

    const goToday = () => {
        date = new Date();
        renderCalender();
    };




}
