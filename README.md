# final-project-group_18
final-project-group_18 created by GitHub Classroom


CS 493 Final Project
Proposal due by 5:00pm on Friday, 5/18/2018
Code and demo due by 5:00pm on Friday, 6/15/2018
In this course, a final programming project will take the place of formal exams to test your understanding of the material.  The final project will involve working with a team of 3-4 people to implement a complete RESTful API that utilizes some of the components of an API that we talked about in class.

The API you implement can be for any application domain, and I encourage you to be creative and to implement an API for a domain in which you’re interested or one that other people will find useful.  You API must simply satisfy the following requirements:

The API is served using a Node.js/Express-based (or other approved) stack.
The API allows clients to interact with at least three different kinds of resources.  API requests and responses for these resources should be well designed.
The API allows resources of all types to be created and read by clients.  At least one type of resource must also be updatable or deletable by clients.
The API is backed by at least two of the following (or similar) data stores:
MySQL
MongoDB
Redis
ElasticSearch
Data in at least one of your API’s data stores is replicated to prevent data loss.
Your API must implement at least one of the following security mechanisms:
Rate-limited API keys
OAuth JWT-based authorization of specific resources
You complete API is containerized and can be launched using Docker Compose.
Your API is documented using the OpenAPI Specification.

You may implement any API that meets these requirements.  If you have ideas for an API that doesn’t meet these requirements but that you believe would be similar in scope, I encourage you to propose your idea to me and to explain how your proposed API would be a sufficient demonstration of your mastery of the course material.

I also encourage you to explore technologies or techniques you’re interested in, even ones that aren’t listed above.  If you’d like to use an alternative to one of the technologies/techniques listed above in your API, please run your idea by me to make sure it’s OK.

There are two deliverables for the final project: a proposal describing  what you’d like to implement and the implementation itself.
Final project proposal
Your final project proposal is due by the deadline listed above.  In this proposal, you should briefly outline the API your team plans to implement for the final project.  It should specifically include the following things:

A list of all of the members of your team.  You should aim to have 3 or 4 people on your team.
A high-level description of the purpose your API will serve, including what resource types your API will work with.
A high-level description of the specific endpoints your API will implement and how these endpoints will interact with the API’s resources.
A description of how data will be stored by your API, including the specific data stores you will use and the specific data you will store there.
A description of the security mechanisms your API will implement.
Submitting your proposal
Before submitting your proposal, you need to put the members of your team into a Canvas group. There is already a set of groups created on Canvas for this purpose. You just need to add your team members to the same group. To do this, you can go to the "People" section of our Canvas course and navigate to the "Final Project Groups" tab. You should see several groups starting with "Final Project Group". You should choose one of these groups to use for your team. If you're the first person to sign up for a group, you should be able to manage the membership of that group and add your teammates.

To submit your proposal, you should save it as a PDF and upload it to Canvas under the appropriate assignment before the due date. Please submit only one copy of your proposal for your entire team. Note that you may receive feedback on your submission asking you to change or clarify particular pieces of the proposal. You should be prepared for this.
Final project implementation
Once your final project proposal is approved, your team may begin implementing your API.  Below is some information about how to proceed with your API implementation.
GitHub repositories
The code for your final project must be in a GitHub repository set up via GitHub Classroom.  You can use this link to form your team and create your final project repository:

https://classroom.github.com/g/L93rw5R9

The repository created for your team will be public by default, and I encourage you to keep it public.  These final projects should be nice demonstrations of your API development abilities and will be a good item to have in your CS portfolio.  It will be great to have the code in a public GitHub repo so you can share it easily when you want to.  However, you will have full administrative control over the repository that’s created for your project, which means you’ll be able to make it private if you wish.

If you’ve already started a GitHub repo for your project, don’t worry.  The repository created via the GitHub classroom link above will be completely empty, so you can simply use git remotes to work with both repositories.  I can help you set that up if needed.
Working with a team on a shared GitHub repo
When working with a team on a shared GitHub repo, it’s a good idea to use a workflow that uses branches and pull requests.  This has a few advantages:

By not working within the same branch, you can better avoid causing conflicts, which can occur when you and another member of your team edit the same parts of the code at the same time.
It helps you to be more familiar with the entire code base, even the parts that other team members are working on, because you’ll see all of the changes to the code as you review pull requests.  This can help you develop more rapidly because you won’t have to spend as much time understanding code that others have written.
It helps to ensure high quality code.  Code in pull requests is not incorporated into the master code branch until the code request is reviewed and approved.  That means everyone has a chance to improve pull request code before it becomes permanent.

One simple but effective branch- and pull-request-based workflow you might consider is the GitHub flow: https://guides.github.com/introduction/flow/.
Grading demonstrations
The grade for your project will include a brief (10-15 minute) demonstration to me (Hess) of your API’s functionality.  To get a grade for your project, your team must do a demo.  Demos will be scheduled for finals week.  I’ll send more details on scheduling when we get closer to that time.
Code submission
All code for your final project must be pushed to the master branch of the repo created for your team using the GitHub Classroom link above before your grading demo.
Grading criteria
Your team’s grade for the final project will be based on successfully implementing a complete API that satisfies the requirements listed above.  Remember, if your team does not do a demo for your project, you will receive a zero for it.
Individual grades
Your individual grade for the project will be based on your team’s grade and also on evidence of your meaningful participation in your team’s work on the project, including from these sources:

The commit log of your GitHub repository.
Your presence at and participation in your team’s project demo.

In particular, if your GitHub commit log shows that you did not make meaningful contributions to your team’s implementation of your app and/or you do not participate in your team’s demonstration of your app (without explicit prior approval by me), you will receive a lower grade on the project than your teammates.  I may use other sources as evidence of your participation, as well.
