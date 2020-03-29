import { html } from '../../core/http.js'

export const Html = html`

<nav> 
  <button pOnclick="toggleSidebar()"><i data-feather="menu"></i></button>
  <button><i data-feather="star"></i></button>
  <button> Omega </button>
  <div class="search-box">
    <i data-feather="search"></i>
    <input type="text" id="search-input">
  </div>
  <div></div>
  <button><i data-feather="bell"></i></button>
  <button><i data-feather="settings"></i></button>
  <button route="/login"><i data-feather="log-out"></i></button>
</nav>

<a class="navbar-brand col-xs-2 col-md-2 mr-0" route="/dashboard" href="#">Bibar JS</a>
<a class="nav-link" route="/login" href="#">Sign out</a>
<hr>
<a class="nav-link active" route="/dashboard" href="#">
  <span data-feather="home"></span>
  Dashboard <span class="sr-only">(current)</span>
</a>
<a class="nav-link" route="/dashboard/contact" href="#">
  <span data-feather="file"></span>
  Contact
</a>
<a class="nav-link" route="/dashboard/about" href="#">
  <span data-feather="shopping-cart"></span>
  about
</a>
<a class="nav-link" route="/dashboard/about/sub?age=15" href="#">
  <span data-feather="users"></span>
  about/sub?age=15
</a>
<a class="nav-link" route="/dashboard/users" href="#">
  <span data-feather="bar-chart-2"></span>
  users
</a>
<a class="nav-link" route="/dashboard/users/35" href="#">
  <span data-feather="layers"></span>
  users/35
</a>
<a class="d-flex align-items-center text-muted" route="users/35/manage" href="#">
  <span data-feather="plus-circle"></span>
</a>


<main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
  <button route="/dashboard">Root</button>
  <button route="/dashboard/login">login</button>
  <button route="/dashboard/about">about</button>
  <button route="/dashboard/about/sub?age=15">about > sub</button>
  <button route="/dashboard/about/location">about > location</button>
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
