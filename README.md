# High‑level architecture & trade‑offs.
The idea behind the entire mono repo was to offer a near free fully selfhostable distributable ready, low boilerplate full stack application. This includes that the application and DB is structured in a way to facilitate multiple instances and for the DB to deal and eliminate race conditions also the tests are structured to spin up a test DB for the CI/CD to test against a running test DB. 

The backend and db is not publically exposed only the frontend is exposed, and the frontend utilizes the docker network to communicate with the different services like frontend to backend and backend to db. You can easily expose the backend if the need arises because it is on a seperate docker container.

My stack of choice was:
* Expressjs for the BE
* Prisma for the DB abstraction and ORM solution
* Postgresql because it is the most popular DB at the moment but with prisma I could easily interchange between prisma's supported DBs ([Prisma supported DBs](https://www.prisma.io/docs/orm/reference/supported-databases))
* Nextjs for the incremental server side rendering
* Mono repo for me to share the generated Prisma models with my FE and BE
* Jenkins opensource CI/CD

## Prisma / Postgresql DB
You can check out my DB structure by navigating to apps/backend/integrations/prisma/models this contains all the prisma models that prisma will use to create the tables, relationships and columns. You use the command <code>npm run prisma:migrate</code> this will convert and apply all the model changes to your DB it will also generate the types and models for your apps to use also it generates a migration file that will be included in your git repo and have version control. The <code>npm run prisma:deploy</code> command is used to apply your migrations onto a DB without creating more migrations. There is also <code>npm run prisma:reset</code> which will reset your connected DB to your existing migrations and also clear out all data from the DB. I used prisma mainly for the DB abstraction it provides aswell as the generation of types which reduces alot of the boilerplate involved for a BE app.

## Backend Expressjs
With my BE I have neatly scaffolded the directories for easy identification of what has been implemented on the app and where their coupling ends. So for each library or api I have a integrations directory and then their name as a example integrations/express, then you know everything express related is in that directory.

My list of integrations:
* ergast for the F1 API we need to query
* express for the generate API setup and CRUD calls (GET, POST, DELETE)
* prisma for the *.prisma models which are then translated into tables through the use of the command prisma migrate which will apply all the models found onto the DB that you connected with via DATABASE_URL enviromental variable. It also has a connection command for when the app starts it will try and connect to DB and retry every 3 seconds on failure. It also has helpers like safeUpsertOrFindUnique which is a function wrapper for any upsert to deal with race conditions with parralel execution onto the DB this is essential for distributed systems.
* swagger for automatic openAPI and documentation generation based off of the @swagger comments in the integrations/express/routers
* winston for advance logging of errors. This uses a middleware on express to log all errors in the console, file and in DB for easy debugging.

Other than the integrations layer I have a services layer. This is where the business logic lays. For each business concern there is a directory with the actual *.service.ts file which is intended to be the main access point for using the service, the service is also wrapped with a class this is to make it easier to mock out the service with unit testing. The service has a *.utils.ts file that is used to seperate different concerns for the service, doing it this way makes the service functions easy to read and you also have the option to test individual util functions to deep dive on issues.

I do not have a data layer because prisma takes care of the data layer concerns.

The app has a main.ts this is the primary entry point for the BE server and the functions that are inside are self explanitory.

The Backend has low boilerplate requirements because you do not have to deal with DTO and viewmodels mapping. The idea is that you specify the query in the shared lib folder then it would defer a model based off of the query and then you use that defered model for both BE and FE. So you do not have to use a DTO to viewmodel mapper. That already saves a lot of boiler plate required to just do basic data fetching commands. The added bonus is that if you change the query it will automatically change the defered model which will cause build error on either the BE or FE ensuring you catch issues far before it reaches your deployment.

If you expose the backend and there are thirdparties using your API they can simply ingest the <code>/swagger.json</code> which is a openAPI spec and can be used to automatically generate the BE server integration for them using tools like <code>@openapitools/openapi-generator-cli</code> on the FE. 

For testing I am using jest which will use a live docker DB the test DB connection string can be specified in the <code>.env.test</code> file if you are running two seperate DBs on local. But by default the Jenkins CI/CD will use a test DB which it clears out after each run. 

How I am approaching the ergast integration is I am exposing two functions in my service layer <code>getChampionBySeasons(startYear, endYear?)</code> and <code>getRaceWinnersBySeason(seasonYear)</code> 

The <code>getChampionBySeasons</code> will check the DB if the year range exists if there are gaps it will identify which years are missing and invoke a ergast API call <code>{ergastRootApi}/driverStandings/1.json?limit={limit}&offset={offset}</code> and get the season data and champion driver with the champion driver constructor, and upsert it in my DB it will not get the races for the season because this is not needed for the landing page and it slows the initial response down because it must make another api call for each season to get that seasons result. If the function is called and all the seasons exist in my DB for the given year range there is no ergast API call.

For a individual season it will invoke the <code>getRaceWinnersBySeason(seasonYear)</code> function here I am checking if a season exists on the DB and if it has the races for that season. If it does not have the season it will invoke 2 ergast API calls <code>{ergastRootApi}/driverStandings/1.json?limit={limit}&offset={offset}</code> and <code>{ergastRootApi}/{year}/results/1.json</code> the one to get the season data and the other call to get the results of that season for me to upsert the races and results into my DB. If the season already exists in my DB without races it will only call 1 ergast api and upsert the races for that season in my DB. If the season exists and does have races attached it will not call the ergast api

For both service functions when they upsert meaning they are actually going to insert or update data I am using a util function wrapper <code>getOrLockAndExecute</code> which will take a key and function to be locked. This locking takes place to deal with simutanious calls to the same service at once and they both try and upsert then this will take the first call and lock the block and any susiquent calls will wait for the block to complete and use the same result.  With this I am catering for distrubeted systems meaing you are hosing multiple containers to deal with the api call load and horizontally scale the BE. So the performance you gain is for read functionality it will execute the reads individually without blocking and for writes it will make it one sigular call to deal with race conditions. 

Further more I have implemented <code>safeUpsertOrFindUnique</code> prisma util wrapper. Which this wrapper it is intented to wrap you upserts if you know that it won't be syncronisly executed and that if a race condition should occur it will simpley query the DB instead of trying to insert or update.

## Frontend Nextjs
I used nextjs for my frontend because it provided a full solutioning for FE including SSR or in my case I am using ISSR(incremental server side rendering). The reason I am using ISSR is, only my FE is exposed and the BE and DB is hosted on the same docker network but not accessable for my FE prod build for it to fetch the data it needs to SSG (static site generation). This means each time I redeploy the FE it will not have a static version of the pages but as your users use the website it will statically generate the dynamic pages. So the next time a user navigates to the same page the server will be serving them a static page. This give you the best of both worlds having super fast load time but also having full control over the caching of the page.

## Mono Repo
With the mono repo that has a shared lib project in the middle of the FE and BE it makes it easier to detech error at development time for both sides of the application if there are changes in the DB or on the query. It is also shared in a way that only the BE can connect to the prisma client which connects to my DB and the FE only gets the generated query models to use.

The shared lib is also responsible for anything that is needed to share between the two apps. Like zod schemas that can be used for FE or BE validation, constants or helpers.

## Jenkins opensource CI/CD
The mono repo is equipped with a pre-configured Jenkins docker setup. When you run the command <code>npm run docker:jenkins:start</code> it will spin up jenkins with a preconfigured job and pipeline that exists on the git repo under docker/jenkins/config here are two files /init.groovy.d/create-job.groovy which is the initial job and Jenkinsfile which is the pipeline configuration. This means that you can easily change the pipeline for CI/CD within the git repo. 

The Jenkinsfile is already preconfigured to get latest change -> npm i -> DB setup (applies prisma structure and clears the test DB) -> Lint all apps -> Build all apps -> Test all apps -> Deploy apps(on this step it will apply prisma structure onto prod DB. Create a prod container for both FE and BE and run them on docker it also has a conditional step if you have <code>cloud-flare-tunnel-token</code> setup on the Jenkins credential vault it will then additionally spin up a cloud-flare-tunnel service and expose and host the FE from your docker network to a configured domain that you setup on cloudflare)

# How to run
## !!!Make sure you use the .env.sample and fill out all the enviromental variable required!!!


## Jenkins CI/CD setup
```sh
npm run docker:jenkins:start
```
after this command jenkins, test-db, prod-db and adminer container wil spin up
* adminer is for connecting to the DB directly [http:localhost:8085](http:localhost:8085)
* jenkins UI [http:localhost:8080](http:localhost:8080)

You navigate to the jenkins UI and follow the onscreen setup which will ask for a administrator account token which will be in the logs of the jenkins docker container which you can just copy and past in. After that it allows you to create a jenkins admin user to login after that click on the option to install recommended plugins and then it will install and finalize jenkins. Then you will be navigated to the dashboard where you will find the preconfigured CI/CD for this mono repo.