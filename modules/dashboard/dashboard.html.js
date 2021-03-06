import { html } from '../../core/http.js'

export const Html = html`
<nav> 
  <!-- <button pOnclick="toggleSidebar()">menu</button> -->
  <button id="menu"> <span class="material-icons">menu</span> </button>
  <button> <span class="material-icons">star</span> </button>
  <button> Omega </button>
  <div class="search-box">
    <input type="text" id="search-input">
    </div>
    <div></div>
    <button> <span class="material-icons">notifications</span> </button>
    <button> <span class="material-icons">settings</span> </button>
    <button> <go-to route="/login"> <span class="material-icons">exit_to_app</span> </go-to> </button>
    <!-- <button route="/login">&#128682;</button> -->
  </nav>

  <!-- <p route="/login"> ooo <div class="deleteThis"> go to login </div> </p> -->
  <div> سڵاو </div>
  <div> <go-to route="/login"> go to login inside go-to </go-to> </div>
  <side-bar status="open" width="9rem"></side-bar>

  <p> !!!! </p>
  <p> <di-ct>hello</di-ct> </p>
  <p> <di-ct>bye</di-ct> </p>
  <p> <di-ct>no-exist</di-ct> </p>
  <a class="navbar-brand col-xs-2 col-md-2 mr-0" route="/dashboard" href="#">Bibar JS</a>
  <a class="nav-link" route="/login" href="#">Sign out</a>
  <hr>
    <a class="nav-link active" route="/dashboard" href="#">
      Dashboard <span class="sr-only">(current)</span>
    </a>
    <a class="nav-link" route="/dashboard/contact" href="#">
      Contact
    </a>
    <a class="nav-link" route="/dashboard/about" href="#">
      about
    </a>
    <a class="nav-link" route="/dashboard/about/sub?age=15" href="#">
      about/sub?age=15
    </a>
    <a class="nav-link" route="/dashboard/users" href="#">
      users
    </a>
    <a class="nav-link" route="/dashboard/users/35" href="#">
      users/35
    </a>
    <a class="d-flex align-items-center text-muted" route="users/35/manage" href="#">
      plus
    </a>


    <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">

      <button route="/dashboard">Root</button>
      <button route="/dashboard/login">login</button>
      <button route="/dashboard/about">about</button>
      <button route="/dashboard/about/sub?age=15">about > sub</button>
      <button route="/dashboard/about/location">about > location</button>
      <button route="/dashboard/content/112">content > 112</button>
      <button route="/dashboard/content/112?search=99&limit=15">content > 112 ? search=99 & limit 15</button>
      <button route="/dashboard/about/history/2016">about > history > 2016</button>
      <button route="/dashboard/about/history/2016/sort">about > history > 2016 > sort</button>
      <button route="/dashboard/users">users </button>
      <button route="/dashboard/users/35">users > 35</button>
      <button route="/dashboard/users/35/manage">users > 35 > manage</button>
      <button route="/dashboard/users/35/view">users > 35 > view</button>
      <button route="/dashboard/contact">contact</button>
      <button route="/dashboard404">404</button>
      <button route="/dashboard/user/24/save">user</button>
      <button func="btnLogin()"> hello </button>

      <!-- the outlet is here -->
      <div id="dashboardOutlet">this is dashbord outlet </div>

    </main>
    `;
