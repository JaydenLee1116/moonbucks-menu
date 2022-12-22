// step1 요구사항 구현을 위한 전략
// TODO 메뉴 추가
// - [x] 메뉴의 이름을 입력받고 엔터키를 누르면 메뉴가 추가된다.
// - [x] 메뉴의 이름을 입력받고 확인 버튼을 누르면 메뉴를 추가한다.
// - [x] 추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [x] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// - [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.

const $ = (selector) => document.querySelector(selector);

function App() {
  $('#espresso-menu-form').addEventListener('submit', (e) => {
    e.preventDefault();
  });
  const updateMenuCount = () => {
    const menuCount = $('#espresso-menu-list').querySelectorAll('li').length;
    $('.menu-count').innerText = `총 ${menuCount} 개`;
  };
  const addEspressoMenuName = () => {
    const $espressoMenuName = $('#espresso-menu-name');
    if (!$espressoMenuName.value) {
      alert('값을 입력해주세요!');
      return;
    }
    const menuItemTemplate = (espressoMenuName) => {
      return `<li class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
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
    };
    const $espressoMenuList = $('#espresso-menu-list');
    $espressoMenuList.insertAdjacentHTML('beforeend', menuItemTemplate($espressoMenuName.value));
    updateMenuCount();
    $espressoMenuName.value = '';
  };
  const updateEspressoMenuName = (e) => {
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    $menuName.innerText = prompt('수정할 메뉴명을 입력해주세요!', $menuName.innerText);
  };
  const removeEspressoMenuName = (e) => {
    if (confirm('해당 메뉴를 삭제하시겠습니까?')) {
      e.target.closest('li').remove();
      updateMenuCount();
    }
  };

  $('#espresso-menu-submit-button').addEventListener('click', addEspressoMenuName);

  $('#espresso-menu-name').addEventListener('keypress', (e) => {
    if (e.key !== 'Enter') return;
    addEspressoMenuName();
  });

  $('#espresso-menu-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('menu-edit-button')) {
      updateEspressoMenuName(e);
    }
    if (e.target.classList.contains('menu-remove-button')) {
      removeEspressoMenuName(e);
    }
  });
}

App();

// TODO 메뉴 수정
// - [x] 메뉴 수정 버튼을 누르면 prompt 모달창이 뜬다.
// - [x] 해당 모달창을 통해 변경할 메뉴 이름을 받고 확인 버튼을 누르면 메뉴가 수정된다.

// TODO 메뉴 삭제
// - [x] 메뉴 삭제 버튼을 누르면 confirm 모달창이 뜬다.
// - [x] 확인 버튼을 누르면 해당 메뉴가 삭제된다.
