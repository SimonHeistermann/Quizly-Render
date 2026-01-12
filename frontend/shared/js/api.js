async function createQuiz(url) {
  document.querySelector(".overlay").classList.remove("d_none");
  url = url.trim();
  try {
    let response = await fetch(`${API_BASE_URL}${CREATE_QUIZ_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: url }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      showToastMessage(true, ["Error generating quiz"]);
      document.querySelector(".overlay").classList.add("d_none");
      return null;
    }
    document.querySelector(".overlay").classList.add("d_none");
    return data;
  } catch (error) {
    document.querySelector(".overlay").classList.add("d_none");
    showToastMessage(true, ["Error while sending URL"]);
    return null;
  }
}

async function loadQuizzes(id) {
  let url = `${API_BASE_URL}${GET_QUIZ_URL}`;
  if (id) {
    url = `${API_BASE_URL}${GET_QUIZ_URL}${id}/`;
  }
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    showToastMessage(true, ["Error while sending URL"]);
  }
}

async function updateQuiz(id, quiz) {
  let url = `${API_BASE_URL}${GET_QUIZ_URL}`;
  if (id) {
    url = `${API_BASE_URL}${GET_QUIZ_URL}${id}/`;
  }
  try {
    let response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify({
        title: quiz.title,
        description: quiz.description,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    showToastMessage(true, ["Error while updating Quiz"]);
  }
}
