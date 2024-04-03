# MVCE for PayloadCMS lexical perfomance issues

I'm trying to find out why my app gets slower over time. I've created this MVCE that contains only those parts that I suspect to be the cause of the problem.

## Steps to reproduce

1. `yarn`
1. `yarn seed` -> copy the id of the first page
1. `yarn build`
1. `yarn serve`

1. use a tool like [autocannon](https://www.npmjs.com/package/autocannon) to send some requests to the API endpoint that returns one of the pages `http://localhost:3000/api/pages/<page_id>` (fill in the page id you copied earlier)
1. watch the response time increase
