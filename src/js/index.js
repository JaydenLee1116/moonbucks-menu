// TODO step1 요구사항 구현을 위한 전략
// 메뉴 추가
// - [x] 메뉴의 이름을 입력받고 엔터키를 누르면 메뉴가 추가된다.
// - [x] 메뉴의 이름을 입력받고 확인 버튼을 누르면 메뉴를 추가한다.
// - [x] 추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [x] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// - [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.

// 메뉴 수정
// - [x] 메뉴 수정 버튼을 누르면 prompt 모달창이 뜬다.
// - [x] 해당 모달창을 통해 변경할 메뉴 이름을 받고 확인 버튼을 누르면 메뉴가 수정된다.

// 메뉴 삭제
// - [x] 메뉴 삭제 버튼을 누르면 confirm 모달창이 뜬다.
// - [x] 확인 버튼을 누르면 해당 메뉴가 삭제된다.

// TODO step2 요구사항 - 상태 관리로 메뉴 관리하기
// - [x] localStorage에 데이터를 저장한다.(추가, 수정, 저장)
// - [x] 새로고침해도 데이터가 남아있게 한다.
// - [x] 아래의 종류 별로 메뉴판을 관리한다.
// - [x] 에스프레소
// - [x] 프라푸치노
// - [x] 블렌디드
// - [x] 티바나
// - [x] 디저트
// - [x] 페이지에 최초로 접근 시, 에스프레소 메뉴가 보이게 한다.
// - [x] 품절 버튼을 추가한다.
// - [x] `sold-out` class를 추가하여 상태를 변경한다.

// TODO step3 요구사항 - 서버와의 통신을 통해 메뉴 관리하기

// - [x] 웹 서버를 띄운다.
// - [x] 서버에 메뉴명 추가를 요청한다.
// - [x] 서버에 카테고리별 메뉴리스트를 읽어오도록 요청한다.
// - [x] 서버에 메뉴명 수정을 요청한다.
// - [x] 서버에 메뉴 품절상태 수정을 요청한다.(토글될 수 있도록)
// - [x] 서버에 메뉴 삭제를 요청한다.

// - [x] localStorage에 저장하는 로직은 지운다.
// - [x] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

// - [x] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 [alert](https://developer.mozilla.org/ko/docs/Web/API/Window/alert)으로 예외처리를 진행한다.
// - [x] 중복되는 메뉴는 추가할 수 없다.

import { $ } from './utils/dom.js';
import store from './store/index.js';
import MenuApi from './api/index.js';

function App() {
  // 상태(변할 수 있는 데이터) - 메뉴명(갯수는 어차피 메뉴가 담긴 배열의 길이기 때문에 따로 저장할 필요가 없다.)
  $('#menu-form').addEventListener('submit', (e) => {
    e.preventDefault();
  });

  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = 'espresso'; // 초기엔 espresso 메뉴가 나오게끔
  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuCategory(this.currentCategory);
    render();
    initEventListeners();
  };

  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuCategory(this.currentCategory);
    const template = this.menu[this.currentCategory]
      .map((item) => {
        return `<li data-menu-id='${item.id}' class="menu-list-item d-flex items-center py-2">
          <span class="${item.isSoldOut ? 'sold-out' : ''} w-100 pl-2 menu-name">${item.name}</span>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
          >
            품절
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
          >
            수정
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
          >
            삭제
          </button>
        </li>`;
      })
      .join('');
    const $menuList = $('#menu-list');
    $menuList.innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $('.menu-count').innerText = `총 ${menuCount} 개`;
  };

  const addMenuName = async () => {
    const $menuName = $('#menu-name');
    if (!$menuName.value) {
      alert('값을 입력해주세요!');
      return;
    }

    const duplicatedItem = this.menu[this.currentCategory].find((item) => item.name === $menuName.value);
    if (duplicatedItem) {
      alert('이미 등록된 메뉴입니다! 다시 입력해주세요!');
      $menuName.value = '';
      return;
    }

    await MenuApi.createMenu(this.currentCategory, $menuName.value);

    render();
    $menuName.value = '';
  };

  const updateMenuName = async (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const updatedMenuName = prompt('수정할 메뉴명을 입력해주세요!', $menuName.innerText);
    await MenuApi.updateMenu(this.currentCategory, updatedMenuName ? updatedMenuName : $menuName.innerText, menuId);

    render();
  };

  const removeMenuName = async (e) => {
    if (confirm('해당 메뉴를 삭제하시겠습니까?')) {
      const menuId = e.target.closest('li').dataset.menuId;
      await MenuApi.removeMenu(this.currentCategory, menuId);

      render();
    }
  };

  const soldOutMenuName = async (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    await MenuApi.soldOutMenu(this.currentCategory, menuId);

    render();
  };

  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains('cafe-category-name');
    if (isCategoryButton) {
      this.currentCategory = e.target.dataset.categoryName;
      $('#category-title').innerText = `${e.target.innerText} 메뉴 관리`;

      render();
    }
  };

  const initEventListeners = () => {
    $('#menu-submit-button').addEventListener('click', addMenuName);

    $('#menu-name').addEventListener('keypress', (e) => {
      if (e.key !== 'Enter') return;
      addMenuName();
    });

    $('#menu-list').addEventListener('click', (e) => {
      if (e.target.classList.contains('menu-edit-button')) {
        updateMenuName(e);
        return; // 여기 if문에 해당되면 굳이 아래 if문들 볼 필요없으니까 return 처리해주는 습관
      }
      if (e.target.classList.contains('menu-remove-button')) {
        removeMenuName(e);
        return;
      }
      if (e.target.classList.contains('menu-sold-out-button')) {
        soldOutMenuName(e);
      }
    });

    $('nav').addEventListener('click', changeCategory);
  };
}

const app = new App();
app.init();
