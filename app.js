/* structure 
 1.State
 2.Data
 3.Helpers
 4. Rendering functions
 5. Event handlers
 6. Initialization
*/

/* 1.State */
const state = {
    billing: "monthly", 
    activiTab: "speed", // speed, quality, scale
}

/* 2. Get the element we need to interact with */
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

const tabPanel = document.getElementById("tabPanel");
const tabs = Array.from(document.querySelectorAll(".Tab"));

const billingToggle = document.getElementById("billingToggle");
const pricingCards = document.getElementById("pricingCards");

/* 2. Data for the app */
const featureCopy = {
    speed: {
        title: "Speed that actually matters",
        body: "Less waiting, fewer clicks, cleaner UI. You will feel it instantly.",
        points:[
            "Fast layout patterns (Grid/Flex used properly)",
            "No messay DOM updates all over the place",
            "Clear separation: data -> render -> events",
        ],
    },

    quality:{
        title: "Quality by default",
        body: "Semantic HTML, accessible basics, and maintainable CSS. Not vibes-only code.",
        points:[
            "Structure that makes sense even without CSS",
            "Reusable styles insterd of copy/paste classes",
            "Predictable behaviour from clean JS logic",
        ],
    },

    scale:{
        title: "Scale in to React/Next.js",
        body: "Same idea:state drives UI, UI is a function of data.",
        points:[
            "State object is your single source of truth",
            "Render function are your 'components' today",
            "Events update state, then youre-render",
        ],
    },
};

// Pricing plans are also plain data.
//we render cards from this array.
const pricing = [{
    name: "Starter",
    monthly : 0,
    annual: 0,
    perks: ["1 Project", "Basic components", "Community"],
},
{
    name: "Pro",
    monthly : 12,
    annual: 99,
    perks: ["Unlimited projects", "Reusable UI", "Faster workflow"],
},
{
    name: "Team",
    monthly : 29,
    annual: 249,
    perks: ["Team setup", "Shared patterns", "Review checklist"],
},
];

/* 3. Helpers */
function savePref() {
    //store only what we need to remember
    localStorage.setItem("cca_pref", JSON.stringify({
        billing: state.billing,
        activiTab: state.activiTab,
    }));
}

function loadPref() {
    //read saved preferences safely
    try{
        const saved = JSON.parse(localStorage.getItem("cca_pref"));
        if(!saved) return;

        if(saved.billing === "monthly" || saved.billing === "annual"){
            state.billing = saved.billing;
        }

        if(featureCopy[saved.activiTab]){
            state.activiTab = saved.activiTab;
        }
    }catch{
        //somthing is corrupted, igne it
    }
}

//small helper to smooth scroll to a section
function scrollToId(id){
    const el = document.getElementById(id);
    if(!el) return;
    el.scrollIntoView({ behavior: "smooth"});
}

/* 4. Rendering functions */
function renderNavButton(open){
    //keep accessibility state in sync
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
}

function renderTabs() {
    // Render the content based on the active tab in state
    const data = featureCopy[state.activiTab];

    tabPanel.innerHTML = `
    <div>
       <h3 style="margin:0 0 12px;">${data.title}</h3>
       <p>${data.body}</p>
       <ul>
          ${data.points.map((p) => `<li>${p}</li>`).join("")}
       </ul>
    </div>
    `;

    //update the tab buttons style (active/inactive)
    tabs.forEach((btn) => {
        const isActive = btn.dataset.btn === state.activiTab;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });
}

function renderBillingToggle() {
    //set the checkbox based on state
    billingToggle.checked = state.billing === "annual";
}

function renderPricing(){
    const isAnnual = state.billing === "annual";

    //build the cards HTML by mapping the pricing data to card markup
 pricingCards.innerHTML = pricing
    .map((plan) => {
        const price = isAnnual ? plan.annual : plan.monthly;
        const suffix = isAnnual ? "/yr" : "mo";

        return `
        <article class="Card">
            <h3 style="margin: 0;">${plan.name} </h3>
            <div class="Card__price">$${price}${suffix}</div>
            <ul>
                ${plan.perks.map((p) => `<li>${p}</li>`).join("")}
            </ul>
            
            <button class="Btn Btn--primary" type="button" data-plan="${plan.name}">
            Choose ${plan.name}
            </button>
        </article>
    `;
    })
    .join("");
}


function renderAll(){
    //one place to refresh the UI from state
    renderBillingToggle();
    renderTabs();
    renderPricing();
}


/* 5. Event handlers */
menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    renderNavButton(open);
});

tabs.forEach(btn => {
    btn.addEventListener("click", () => {
        state.activiTab = btn.dataset.tab;
        savePref();
        renderTabs();
    });
});

billingToggle.addEventListener("change", () => {
    state.billing = billingToggle.checked ? "annual" : "monthly";
    savePref();
    renderPricing(); // only re-render the pricing cards, not the whole page
});

pricingCards.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-plan]");
    if(!btn) return;

    const plan = btn.dataset.plan;

    //give the user a simple promt + move them to the form
    formMsg.textContent = `Nice - you selected ${plan}. Now sign up below.`;
    scrollToId("signup");
});

/* 6. Form validation (bonus) */
/* 7. Current live user counter (bonus) */
/* 8. Initialization (Boot) function */

loadPref();
renderAll(); // load any saved preference from localStorage






