function ready(handler) {
  if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
    handler();
  } else {
    document.addEventListener('DOMContentLoaded', handler, false);
  }
}

var _clickEvents = ['click', 'touch'];

ready(function () {
  const burgers = document.querySelectorAll('.burger');
  [].forEach.call(burgers, burger => {
    _clickEvents.forEach(clickEvent => {
      burger.addEventListener(clickEvent, e => {
        e.preventDefault();

        const node = e.currentTarget;
        if (node) {
          node.classList.toggle('is-active');
          // Get the target from the "data-target" attribute
          let target = node.dataset.target;
          if (target) {
            const targetNode = document.querySelector(node.dataset.target);
            if (targetNode) {
              targetNode.classList.toggle('is-active');
            }
          }
        }
      });
    });
  });

  const menus = document.querySelectorAll('.menu');
  [].forEach.call(menus, menu => {
    // Open menu which contains the current active item
    let activeMenus = menu.querySelectorAll('.menu-item:not(.has-dropdown).is-active');
    [].forEach.call(activeMenus, (activeMenu) => {
      activeMenu = activeMenu.closest('.menu-item.has-dropdown');
      if (activeMenu) {
        activeMenu.classList.add('is-active');
      }
    });

    let dropdownMenus = menu.querySelectorAll('.menu-item.has-dropdown > .menu-title');
    [].forEach.call(dropdownMenus, (dropdownMenu) => {
      dropdownMenu.addEventListener('click', e => {
        e.preventDefault();
        let currentMenu = e.currentTarget;

        // Toggle current menu
        currentMenu.closest('.menu-item.has-dropdown').classList.toggle('is-active');

        // Close all other active menus
        let otherActiveMenus = menu.querySelectorAll('.menu-item.has-dropdown.is-active');
        [].forEach.call(otherActiveMenus, otherActiveMenu => {
          if (!currentMenu.isEqualNode(otherActiveMenu.querySelector('.menu-title'))) {
            otherActiveMenu.classList.remove('is-active');
          }
        });
      });
    });
  });

  let tabs = document.querySelectorAll('.tabs li a');
  [].forEach.call(tabs, tab => {
    if (window.location.hash) {
      let tabToShow = tab.closest('.tabs').querySelector('[href="' + window.location.hash + '"]');
      let tabContentToShow = document.querySelector(window.location.hash);
      if (tabToShow && tabContentToShow) {
        let tabToHide = tab.closest('.tabs').querySelector('li.is-active');
        if (tabToHide) {
          let tabToHideLink = tabToHide.querySelector('a');
          let tabContentToHide = document.querySelector(tabToHideLink.getAttribute('href'));
          if (tabContentToHide) {
            tabContentToHide.classList.remove('is-active');
          }
          tabToHideLink.classList.remove('is-active');
          tabToHide.classList.remove('is-active');
        }
        tabToShow.closest('li').classList.add('is-active');
        tabContentToShow.classList.add('is-active');
      }
    }

    _clickEvents.forEach(clickEvent => {
      tab.addEventListener(clickEvent, event => {
        event.preventDefault();
        const tab = event.currentTarget;

        let tabToHide = tab.closest('.tabs').querySelector('li.is-active');
        if (tabToHide) {
          let tabToHideLink = tabToHide.querySelector('a');
          let tabContentToHide = document.querySelector(tabToHideLink.getAttribute('href'));
          if (tabContentToHide) {
            tabContentToHide.classList.remove('is-active');
          }
          tabToHideLink.classList.remove('is-active');

          tabToHide.classList.remove('is-active');
        }
        tab.closest('li').classList.add('is-active');

        let tabContentToShow = document.querySelector(tab.getAttribute('href'));
        if (tabContentToShow) {
          tabContentToShow.classList.add('is-active');
        }
      });
    });
  });
});