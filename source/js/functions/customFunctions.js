export const fadeIn = (el, timeout, display) => {
	el.style.opacity = 0;
	el.style.display = display || 'block';
	el.style.transition = `all ${timeout}ms`;
	setTimeout(() => {
		el.style.opacity = 1;
	}, 10);
};
// ----------------------------------------------------
export const fadeOut = (el, timeout) => {
	el.style.opacity = 1;
	el.style.transition = `all ${timeout}ms ease`;
	el.style.opacity = 0;

	setTimeout(() => {
		el.style.display = 'none';
	}, timeout);
};

// ----------------------------------------------------
export function addMultiListener(element, eventNames, listener) {
	var events = eventNames.split(' ');
	for (var i = 0, iLen = events.length; i < iLen; i++) {
		element.addEventListener(events[i], listener, false);
	}
}

// ----------------------------------------------------
export const even = n => !(n % 2);
// ----------------------------------------------------
export const removeCustomClass = (item, customClass = 'active') => {
	item.classList.remove(customClass);
}
// ----------------------------------------------------
export const toggleCustomClass = (item, customClass = 'active') => {
	item.classList.toggle(customClass);
}
// ----------------------------------------------------
export const addCustomClass = (item, customClass = 'active') => {
	item.classList.add(customClass);
}
// ----------------------------------------------------
export const removeClassInArray = (arr, customClass = 'active') => {
	arr.forEach((item) => {
		item.classList.remove(customClass);
	});
}
// ----------------------------------------------------
export const addClassInArray = (arr, customClass = 'active') => {
	arr.forEach((item) => {
		item.classList.add(customClass);
	});
}
// ----------------------------------------------------
export const toggleClassInArray = (arr, customClass = 'active') => {
	arr.forEach((item) => {
		item.classList.toggle(customClass);
	});
}
//-----------------------------------------------------

export const elementHeight = (el, variableName) => {
	// el -- сам елемент (но не коллекция)
	// variableName -- строка, имя создаваемой переменной
	if (el) {
		function initListener() {
			const elementHeight = el.offsetHeight;
			document.querySelector(':root').style.setProperty(`--${variableName}`, `${elementHeight}px`);
		}

		window.addEventListener('DOMContentLoaded', initListener)
		window.addEventListener('resize', initListener)
	}
}

export const elementWidth = (el, variableName) => {
	// el -- сам элемент (но не коллекция)
	// variableName -- строка, имя создаваемой переменной
	if (el) {
		function initListener() {
			const elementWidth = el.offsetWidth;
			document.querySelector(':root').style.setProperty(`--${variableName}`, `${elementWidth}px`);
		}

		window.addEventListener('DOMContentLoaded', initListener);
		window.addEventListener('resize', initListener);
	}
};


//-----------------------------------------------------

export const stickyHeader = (block, duration, delay, type, offset = 0, scrollThreshold = 40) => {
	let lastScrollTop = 0;
	let accumulatedScroll = 0;

	block.style.transition = `all ${duration}ms ${type}`;

	const updateHeaderPosition = () => {
		const currentScroll = window.pageYOffset;
		if (currentScroll > block.offsetHeight + offset) {
			if (currentScroll > lastScrollTop) {
				block.style.top = `-${block.offsetHeight}px`;
				block.style.transitionDelay = '0ms';
				accumulatedScroll = 0;
			} else {
				accumulatedScroll += lastScrollTop - currentScroll;

				if (accumulatedScroll >= scrollThreshold) {
					block.style.top = '0';
					block.style.transitionDelay = `${delay}ms`;
					accumulatedScroll = 0;
				}
			}
		} else {
			block.style.top = '0';
			block.style.transitionDelay = '0ms';
		}

		lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
	};
	const debounce = (func, wait) => {
		let timeout;

		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};

			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	};

	const debouncedUpdateHeader = debounce(updateHeaderPosition, 10);

	window.addEventListener('scroll', debouncedUpdateHeader);
};
export const scrollToSection = (sectionSelector, action) => {
	const section = document.querySelector(sectionSelector);

	window.addEventListener('scroll', () => {
		if (!section) return;

		const rect = section.getBoundingClientRect();

		if (rect.top <= window.innerHeight && rect.bottom >= 0) {
			action();
		}
	});
};

// ----------------------------------------------------
export const initParallaxEffect = (containerSelector) => {
	const container = document.querySelector(containerSelector);
	if (!container) {
		return;
	}

	const image = container.querySelector('img');
	if (!image) {
		return;
	}

	document.addEventListener('mousemove', function (e) {
		const x = e.clientX - container.offsetLeft;
		const y = e.clientY - container.offsetTop;

		const width = container.offsetWidth;
		const height = container.offsetHeight;

		const moveY = ((x - width / 2) / width) * 20;
		const moveX = ((y - height / 2) / height) * 22;

		image.style.transform = `translate(${moveX}px, ${moveY}px)`;
	});
}
// ----------------------------------------------------
export const animateInit = (array, initClass, timing) => {
	let currentIndex = 0;
	document.querySelector(':root').style.setProperty(`--${initClass}`, `${timing}ms`);
	const animateListItem = () => {
		array.forEach(item => item.classList.remove(initClass));
		array[currentIndex].classList.add(initClass);

		currentIndex = (currentIndex + 1) % array.length;
		setTimeout(animateListItem, timing);
	}

	animateListItem();
}
// ----------------------------------------------------
export const scrollToElement = (element, direction) => {
	if (element) {
		const position = element.getBoundingClientRect();
		if (direction === 'up') {
			window.scrollTo({top: position.top + window.scrollY - element.offsetHeight, behavior: 'smooth'});
		} else if (direction === 'down') {
			window.scrollTo({top: position.bottom + window.scrollY, behavior: 'smooth'});
		}
	}
}
// ----------------------------------------------------s

