const container = document.querySelector('.container');
const bar = document.querySelector('.custom-scrollbar');

container.addEventListener('scroll', () => {
  const height =
    (container.clientHeight / container.scrollHeight) * container.clientHeight;

  const top =
    (container.scrollTop / container.scrollHeight) * container.clientHeight;

  bar.style.height = `${height}px`;
  bar.style.transform = `translateY(${top}px)`;
});