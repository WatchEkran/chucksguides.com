const resizer = document.querySelector('.resizer')
const outline = document.getElementById('outline')
const sidebar = document.getElementById('sidebar')

resizer.addEventListener('click', () => {
  if (sidebar.classList.contains('opened')) {
    sidebar.classList.remove('opened')
  } else {
    sidebar.classList.add('opened')
  }
})