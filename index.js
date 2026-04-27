const input = document.getElementById('search-input');
const btn = document.getElementById('search-btn');
const error = document.getElementById('error');

btn.addEventListener('click', () => {
  const username = input.value;
  if (username && username.trim() !== '') {
    document.getElementById('profile').classList.add('hidden');
    document.getElementById('repos').classList.add('hidden');
    document.getElementById('repo-list').innerHTML = "";
    getUser();
  } else {
    error.textContent = 'Please enter a valid GitHub username.';
    error.classList.remove('hidden');
  }
});

async function getUser() {
  try {
    btn.disabled = true;
    let username = input.value;
    username = username.trim();
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) {
      if (res.status === 404) {
        error.textContent = 'User not found';
      } else {
        error.textContent = 'Something went wrong';
      }
      error.classList.remove('hidden');
      return;
    }
    const data = await res.json();
        document.getElementById('name').textContent = data.name;
        document.getElementById('username').textContent = data.login;
        document.getElementById('bio').textContent = data.bio || 'No bio available.';
        document.getElementById('followers').textContent = `Followers: ${data.followers}`;
        document.getElementById('following').textContent = `Following: ${data.following}`;
        document.getElementById('repos-count').textContent = `Public Repos: ${data.public_repos}`;
        document.getElementById('profile-link').href = data.html_url;

        document.getElementById('profile').classList.remove('hidden');

        document.getElementById('repos').classList.remove('hidden');
        error.classList.add('hidden');
        error.textContent = "";
        await getRepos();
    } catch (err) {
        console.error(err);
        error.textContent = 'An error occurred. Please try again.';
        error.classList.remove('hidden');
    }
}

async function getRepos() {
    try {
        let username = input.value;
        username = username.trim();
        const res = await fetch(`https://api.github.com/users/${username}/repos`);
        const data = await res.json();
        if (!res.ok) {
            error.textContent = "Failed to fetch repositories";
            error.classList.remove('hidden');
            return;
        }
        if (res.ok) {
            const reposList = document.getElementById('repo-list');
            reposList.innerHTML = "";
            if(data.length === 0) {
                const div = document.createElement("div");
                div.classList.add('repo-item');
                div.textContent = "No repositories found.";
                reposList.appendChild(div);
            } else {
                data.slice(0, 5).forEach(repo => {
                    const div = document.createElement("div");
                    div.classList.add('repo-item');
                    div.innerHTML = `
                        <h4>${repo.name}</h4>
                        <a href="${repo.html_url}" target="_blank">View Repository</a>
                `;
                reposList.appendChild(div);
                });
            }
            error.classList.add('hidden');
            error.textContent = "";
        }
    } catch (err) {
    console.error(err);
    error.textContent = 'An error occurred. Please try again.';
    error.classList.remove('hidden');
  }finally {
    btn.disabled = false;
  }
}
