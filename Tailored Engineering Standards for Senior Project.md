# 6.4.2 Stakeholder Needs and Requirements Definition Process

## 1. Prepare for Stakeholder Needs and Requirements Definition

### a. Identify the stakeholders who have an interest in the software system throughout its lifecycle.
#### a. 'a'
#### b. Extreme Programming talks about customer input, which I feel can directly relate to stakeholder needs: "Visionary customers can be part of quarterly and weekly planning. They can have a budget, a percentage of the available development capacity, to do with as they please."
#### c. We talked about who could possibly be using the app and threw around the idea of making a campus-wide survey to get opinions from some stakeholders.

### b. Define the stakeholder needs and requirements definition strategy.
#### a. 'd'
#### b. In Extreme Programming, stakeholder needs and requirements are defined using stories: "Early estimation is a key difference between stories and other requirements practices."
#### c. We are creating stories and using planning poker to provide early estimation.

### c. Identify and plan for the necessary enabling systems or services needed to support stakeholder needs and requirements definition.
#### a. 'h'
#### b. I think XP doesn't talk too much about this, but it does talk about something called a 10-minute build, which might be helpful in finding the enabling systems you will need for a full build: "Automatically build the whole system and run all of the tests in ten minutes. A build that takes longer than ten minutes will be used much less often, missing the opportunity for feedback."
#### c. We talked to our client to figure out the most optimal services to use for the time being and have begun to think about when we need to upscale, and what services to swap/migrate to.

### d. Obtain or acquire access to the enabling systems or services to be used.
#### a. 'h'
#### b. I don't think XP says too much about actually accessing these enabling systems, but it does talk a good bit about the usefulness of enabling systems such as CI: "Continuous integration should be complete enough that the eventual first deployment of the system is no big deal."
#### c. This was relatively simple for us, as all the services are free except for the AWS server. We just had to make accounts and sign up for API keys and whatever we needed.

## 2. Define Stakeholder Needs

### a. Define context of use within the concept of operations and the preliminary life cycle concepts.
#### a. 'b'
#### b. XP says: "Plan work a week at a time. Have a meeting at the beginning of every week. During this meeting:

1. Review progress to date, including how actual progress for the previous week matched expected progress.
2. Have the customers pick a week’s worth of stories to implement this week.
3. Break the stories into tasks. Team members sign up for tasks and estimate them."

#### This is a good way to get all context of use from the customer/client.
#### c. In our project, the context of use is defined during our meetings with our client. We talk about how our system will be used and implemented in real life. This helps us make sure the system will fit into normal operations and works well with other systems in general.

### b. Identify stakeholder needs.
#### a. 'd'
#### b. Beck says to identify stakeholder needs through stories: "On an XP team, interaction designers work with customers, helping to write and clarify stories."
#### c. We meet with our client, who is a stakeholder, weekly to create stories.

### c. Prioritize and down-select needs.
#### a. 'e'
#### b. In XP, the customer selects the stories they would like implemented: "Our customer picked the minimal functionality for a first deployment."
#### c. We talk to our client weekly and get her impression of what we should be doing next to meet her goals.

### d. Define the stakeholder needs and rationale.
#### a. 'd'
#### b. In a story, rationale is included as well as needs. ![alt text](image.png)
#### c. Our stories use a current... given... when... then... format, which includes stakeholder needs and rationale.

## 3. Develop the Operational Concept and Other Life Cycle Concepts

### a. Define a representative set of scenarios to identify the required capabilities that correspond to anticipated operational and other life cycle concepts.
#### a. 'b'
#### b. XP says: "Have the customers pick a week’s worth of stories to implement this week." This is a good way to get a small set of representative scenarios to identify required capabilities.
#### c. In our project, we write user stories based on real-world use cases.

### b. Identify the factors affecting interactions between the users and the system.
#### a. 'g'
#### b. XP says: "XP lets you adapt by making frequent, small corrections; moving towards your goal with deployed software at short intervals. You don’t wait a long time to find out if you were going the wrong way." This means it becomes very quick to find factors affecting interaction between users and the system because you get so much user feedback.
#### c. In our project, we have a continuous feedback loop with our client. We will give her the most recent version of the app, get her feedback, implement that feedback, and repeat.

## 4. Transform Stakeholder Needs Into Stakeholder Requirements

### a. Identify the constraints on a system solution.
#### a. 'c'
#### b. Beck says: "To improve overall system throughput you have to first find the constraint; make sure it is working at full speed; then find ways of either increasing the capacity of the constraint, offloading some of the work onto non-constraints, or eliminating the constraint entirely." This is good because only having to deal with a couple of constraints at a time makes the work much easier and more manageable.
#### c. This is a big issue in our project, especially when it comes to the finance integration. We need to follow all guidelines and restraints regarding the storage of personal information, which is quite difficult. We also realize our current database is not going to be able to be upscaled well to a production build.

### b. Identify the stakeholder requirements and functions that relate to critical quality characteristics, such as assurance, safety, security, environment, or health.
#### a. 'f'
#### b. Beck says: "Integrate and test changes after no more than a couple of hours." This ensures stakeholder requirements and functions work.
#### c. Our project includes a CI pipeline. This pipeline will eventually check the safety and security of sensitive data, as well as ensure we are using good coding standards.

# 6.4.4 Architecture Definition Process
## 1. Prepare for Architectural Definition
### a. Review pertinent information and identify key drivers of the architecture.
#### a. 
#### b. 
#### c. 
### b. Identify stakeholder concerns.
#### a. 
#### b. 
#### c. 
### c. Define the architecture definition roadmap, approach, and strategy.
#### a. 
#### b. 
#### c. 
### d. Define architecture evaluation criteria based on stakeholder concerns and key requirements.
#### a. 
#### b. 
#### c. 
### e. Identify and plan for the necessary enabling systems or services needed to support the architecture definition process.
#### a. 
#### b. 
#### c. 
### f. Obtain or acquire access to the enabling systems or services to be used.
#### a. 
#### b. 
#### c. 

## 2. Develop Architectural Viewpoints
### a. Select, adapt, or develop viewpoints and model kinds based on stakeholder concerns.
#### a. 
#### b. 
#### c. 
### b. Establish or identify potential architecture frameworks to be used in developing models and views.
#### a. 
#### b. 
#### c. 
### c. Capture rationale for selection of frameworks, viewpoints, and model kinds.
#### a. 
#### b. 
#### c. 
### d. Select or develop supporting modeling techniques and tools.
#### a. 
#### b. 
#### c. 

## 3. Develop Models and Views of Candidate Architecture
### a. Define the software system context and boundaries in terms of interfaces and interactions with external entities.
#### a. 
#### b. 
#### c. 
### b. Identify architectural entities and relationships between entities that address key stakeholder concerns and critical software system requirements.
#### a. 
#### b. 
#### c. 
### c. Allocate concepts, properties, characteristics, behaviors, functions, or constraints that are significant to architecture decisions of the software system to architectural entities.
#### a. 
#### b. 
#### c. 
### d. Select, adapt, or develop models of the candidate architectures of the software system.
#### a. 
#### b. 
#### c. 
### e. Compose views from the models in accordance with identified viewpoints to express how the architecture addresses stakeholder concerns and meets stakeholder and system/software requirements.
#### a. 
#### b. 
#### c. 
### f. Harmonize the architecture models and views with each other.
#### a. 
#### b. 
#### c. 

## 4. Relate the Architecture to Design
### a. Identify software system elements that relate to architectural entities and the nature of these relationships.
#### a. 'f'
#### b. The Extreme Programming implementation of this task is using tests to identify the elements and the nature of the relationships. A quote that supports this answer is: "Tests can communicate architectural intent." (Page 39)
#### c. Our project is implementing this task by having a separate class containing tests corresponding to each architectural entity. For example, our class UserTest contains tests corresponding to the User architectural entity.
### b. Define the interfaces and interactions among the software system elements and external entities.
#### a. 'f'
#### b. The Extreme Programming implementation of this task is to first write tests and then write interfaces and code that interacts with these tests. A quote that supports this answer is: "In XP, when possible, tests are written in advance of implementation. There are several advantages to writing the tests first. Folk wisdom in software development teaches that interfaces shouldn’t be unduly influenced by implementations. Writing a test first is a concrete way to achieve this separation." (Page 46)
#### c. Our project is implementing this task by having GitHub automated tests that run whenever the repo is pushed to.
### c. Partition, align, and allocate requirements to architectural entities and system elements.
#### a. 'i'
#### b. The Extreme Programming implementation of this task is to partition, align, and allocate requirements gradually for small parts of the system at a time. A quote that supports this answer is: "Partitioning isn’t an up-front, once-and-for-all task, though. Rather than divide and conquer, an XP team conquers and divides. First a small team writes a small system. Then they find the natural fracture lines and divide the system into relatively independent parts for expansion. The architects help choose the most appropriate fracture lines and then follow the system as a whole, keeping the big picture in mind as the groups focus on their smaller section." (Page 39)
#### c. Our project is implementing this task by having weekly meetings where group members discuss requirements to add and divide up tasks to programming pairs to implement these requirements.
### d. Map software system elements and architectural entities to design characteristics.
#### a. 'i'
#### b. The Extreme Programming implementation of this task is to regularly update the design characteristics of system as the system changes. A quote that supports this answer is: "Invest in the design of the system every day. Strive to make the design of the system an excellent fit for the needs of the system that day. When your understanding of the best possible design leaps forward, work gradually but persistently to bring the design back into alignment with your understanding." (Page 30)
#### c. Our project is implementing this task by having regular meetings with our mentor where we show off our app and get feedback on how the design should be updated.
### e. Define principles for the software system design and evolution.
#### a. 'i'
#### b. The Extreme Programming implementation of this task is to get to work as soon as possible and to improve overtime. A quote that supports this answer is: "In translating values to practices, the principle of improvement shows in practices that get an activity started right away but refine the results over time. The quarterly cycle is an expression of the possibility of improving long-term plans in the light of experience. Incremental design puts improvement to work by refining the design of the system. The actual design will never be a perfect reflection of the ideal, but you can strive daily to bring the two closer." (Page 22)
#### c. Our project is implementing this task as we first developed a minimum viable product and made improvements from there.

## 5. Assess Architecture Candidates
### a. Assess each candidate architecture against constraints and requirements.
#### a. 'e'
#### b. The Extreme Programming implementation of this task is to find the current constraint in the system and either eliminate it or reduce its impact. A quote that supports this answer is: "The Theory of Constraints says that in any system there is one constraint at a time (occasionally two). To improve overall system throughput you have to first find the constraint; make sure it is working full speed; then find ways of either increasing the capacity of the constraint, offloading some of the work onto non-constraints, or eliminating the constraint entirely." (Page 42)
#### c. Our project is implementing this task as when we wanted to add connection to Google calendar to our application we identify that using Expo Go was our constraint so we switched to downloading an APK.
### b. Assess each candidate architecture against stakeholder concerns using evaluation criteria.
#### a. 'a'
#### b. The Extreme Programming implementation of this task is to have the stakeholder write stories that will give the developers criteria to help them create the system. A quote that supports this answer is: "Some of our customers are great. They write good stories. They write acceptance test criteria. They help testers write acceptance tests. Some of the customers aren’t so good. They want to write high-level stories, but they aren’t interested in writing acceptance test criteria. In those cases, we have some very experienced developers who know a lot about the domain fill in." (Page 53)
#### c. Our project is implementing this task by having stories on our GitHub and tasks related to these stories.
### c. Select the preferred architectures and capture key decisions and rationale.
#### a. 'e'
#### b. The Extreme Programming implementation of this task is to frequently have the team explain their decisions and rationale to the stakeholder. A quote that supports this answer is: "Executives should expect honesty and clear explanations of options from the team in any decision-making process. The executive needs to keep perspective in the face of problems, focusing on the actual needs of the organization and requirements of the project even when faced with the need to cut scope. Because of frequent, open communication, when such a decision is required, the executive already has the information necessary to make an informed decision." (Page 40)
#### c. Our project is implementing this task by having weekly meetings on Google Meet where we communicate our decisions and rationale to our mentor.
### d. Establish the architecture baseline of the selected architecture.
#### a. 'e'
#### b. The Extreme Programming implementation is to write automated tests to establish a baseline. A quote that supports this answer is: "XP creates and maintains a comprehensive suite of automated tests, which are run and rerun after every change (many times a day) to ensure a quality baseline." (Page 14)
#### c. Our project is implementing this task by having automated tests in our GitHub that establish our architecture baseline.

## 6. Manage the Selected Architecture
### a. Formalize the architecture governance approach and specify governance-related roles and responsibilities, accountabilities, and authorities related to design, quality, security, and safety.
#### a. 'i'
#### b. The Extreme Programming implementation of this task is to find the simplest way to create a system that meets the design, quality, security, and safety requirements. A quote that supports this answer is: "I ask people to think about the question, 'What is the simplest thing that could possibly work?' Critics seem to miss the second half of the question. 'Well, we have serious security and reliability constraints so we couldn’t possibly make our system simple.' I’m not asking you to think about what is too simple to work, just to bias your thinking toward eliminating wasted complexity." (Page 19)
#### c. Our project is implementing this task by creating a minimum viable product.
### b. Obtain explicit acceptance of the architecture by stakeholders.
#### a. 'i'
#### b. The Extreme Programming implementation of this task is have the stakeholders make explicit goals for the developers to meet. A quote that supports this answer is: "Planning makes goals and directions clear and explicit. Planning in XP starts with putting the current goals, assumptions, and facts on the table. With current, explicit information, you can work toward agreement about what’s in scope, what’s out of scope, and what to do next." (Page 43)
#### c. Our project is implementing this task by having our mentor write stories for us to implement and showing the implemented stories to our mentor to get them approved.
### c. Maintain concordance and completeness of the architectural entities and their architectural characteristics.
#### a. 'e'
#### b. The Extreme Programming implementation of this task is to use redundancy when necessary to maintain concordance and completeness, but to eliminate redundancy when it is not necessary. A quote that supports this answer is: "While redundancy can be wasteful, be careful not to remove redundancy that serves a valid purpose. Having a testing phase after development is complete should be redundant. However, eliminate it only when it is proven redundant in practice by not finding any defects several deployments in a row." (Page 23)
#### c. Our project is implementing this task by using automated tests that run every time code is pushed to git to ensure our code is concordant and complete without having to redundantly manually test it.
### d. Organize, assess, and control evolution of the architecture models and views to help ensure that the architectural intent is met and the architectural vision and key concepts are correctly implemented.
#### a. 'd'
#### b. The Extreme Programming implementation of this task to use tests to ensure architectural test to ensure intent is met and the system is correctly implemented. A quote that supports this answer is: "Tests can communicate architectural intent. I talked with the architect of a major credit card processor who said that in such a high-capacity environment you don’t want any architecture that might get in the way. To achieve this his team had a sophisticated stress testing environment. When they wanted to improve the architecture they would first improve the stress tests until the system broke. Then they would improve the architecture just enough to run the tests." (Page 39)
#### c. Our project is implementing this task by having different classes full of tests that ensure each key concept is correctly implemented such as our UserTest class which ensures the user concept is correctly implemented.
### e. Maintain the architecture definition and evolution strategy.
#### a. 'j'
#### b. The Extreme Programming implementation of this task is to make changes in small steps. A quote that supports this answer is: "A concern for quality is no excuse for inaction. If you don’t know a clean way to do a job that has to be done, do it the best way you can. If you know a clean way but it would take too long, do the job as well as you have time for now. Resolve to finish doing it the clean way later. This often occurs during architectural evolution, where you have to live with two architectures solving the same problem while you transition from one to the other. Then the transition itself becomes a demonstration of quality: making a big change efficiently in small, safe steps." (Page 24)
#### c. Our project is implementing this task by coming up with small tasks to work on for each week at each weekly meeting and getting them done by the next weekly meeting.
### f. Maintain traceability of the architecture.
#### a. 'k'
#### b. The Extreme Programming implementation of this task is only do work that explicitly meets the needs of the users. A quote that supports this answer is: "At any time you should be able to trace a path from the work done back to an explicitly expressed need from the users. No work should be done for its own sake. If you work in safety-critical systems, the principle of traceability is important for gaining certification for your systems." (Page 21)
#### c. Our project is implementing this task by having our mentor write stories and implementing features for our applications that meet the needs of these stories.
### g. Provide key artifacts and information items that have been selected for baselines.
#### a. 'h'
#### b. The Extreme Programming implementation of this task is regularly update the baseline for what to provide next as the key artifacts and information items are selected. A quote that supports this answer is: "Negotiated scope contracts are a piece of software development advice. They are a mechanism for aligning the interests of suppliers and customers to encourage communication and feedback, and to give everyone the courage to do what looks right today, not do something ineffective just because it is in the contract. They might be unwise for you at the moment for business or legal reasons. Moving in the direction of negotiated scope gives you a source of information with which to improve." (Page 37)
#### c. Our project is implementing this task by adding features to the application that meet the previous week's features and coming up with new features to make next week every week.


# 6.4.5 Design Definition Process
## 1. Prepare for Software System Design Definition.
### a. Define the design definition strategy, consistent with the selected life cycle model and anticipated design artifacts.
#### a. 'a'
#### b. XP says: 'Invest in the design of the system every day. Strive to make the design of the system an excellent fit for the needs of the system that day.' This is the basis of incremental design.
#### c. We implemented incremental design by first designing the pages for every type of event (calendar, finance, meal etc...). We then got it approved by the client and wrote unit test cases for all functions we would need. Then write the backend code and ensure it passes all test cases. Finally integrate with the UI and perform end-to-end testing. We then repeated this process for all add event pages and link google calendar
### b. Select and prioritize design principles and design characteristics.
#### a. 'a'
#### b. The XP concept of "Simple Design" is one of our most important principles- “What is the simplest thing that could possibly work?”" In addition the XP concept of feedback ("Change is inevitable, but change creates the need for feedback.") 
#### c. We implement these by always trying to get the design to be the "simplest thing that solves X problem". Initially we had separate add forms for every different type of event, even though the structure is the same. We are now using a genericAddForm for creating events. This form takes in all parameters eg. What to do on save, What fields (including type). This makes it the simplest design as it maintains consistency and ensures reusing of code. Feedback is to be implemented showing the user responses from the system (such as event saved successfully!)
### c. Identify and plan for the necessary enabling systems or services needed to support design definition.
#### a. 'c'
#### b. One enabling system is Continuous Integration: "The most common style of continuous integration is asynchronous. I check in my changes. Soon thereafter, the build system notices the change and starts to build and test." This ensures each step of incremental design is passing.
#### c. We practice Continuous Integration by setting up a github CI pipeline. Each push triggers a series of checks (linter, code coverage, run test cases). We use mockito for writing test cases and ensuring a change does not break an existing feature. We have certain SQLite scripts for setting up the DB with the data required for a user to proceed
### d. Obtain or acquire access to the enabling systems or services to be used.
#### a. 'g'
#### b. XP recommends pair programming: "Pair programming helps teammates demonstrate their commitment to quality to each other and helps them normalize their expectations for what constitutes quality." This enforces quality control through CI testing on all contributions made by all members.
#### c. Every person has a copy of the GitHub repo on their own device and we practice pair programming to ensure GitHub CI is well ingrained in our system.

## 2. Establish Designs Related to Each Software System Element.
### a. Transform architectural and design characteristics into the design of software system elements.
#### a. 'b'
#### b. In Chapter 7: Incremental Design, Beck states, “Incremental design is the practice of growing the system a bit at a time,” which emphasizes designing the software elements with the flexibility to evolve as requirements and design needs emerge. Additionally, in Chapter 9: Code and Tests, Beck highlights that “Tests document the code’s functionality, keeping everyone on the same page,” ensuring that design characteristics are preserved through continuous testing and refactoring.
#### c. For Omniplanner, we translated architectural characteristics like modularity and flexibility into software elements by designing modular components (e.g., separate modules for different pages and task management). This modular approach, combined with test-driven development, allowed us to build a flexible, maintainable system that could adapt to future changes in integration requirements or feature expansions.
### b. Define and prepare or obtain the necessary design enablers.
#### a. 'c'
#### b. XP states: "designers on an XP team choose overall metaphors for the system, write stories, and evaluate usage of the deployed system to find opportunities for new stories" This almost makes the designers of the system the design enablers.
#### c. We ensured that one person was taking minutes at every meeting so we had a clear picture of what the client wanted (if we forgot). We then write the stories and get approval from the client. Post that, tasks are assigned (through planning poker). We then go about with design and development.
### c. Examine design alternatives and feasibility of implementation.
#### a. 'e'
#### b. XP states: "The equivalent transformation is daily business in software. A distributed system might use remote procedure calls as its initial communication technology. As experience with the system grows, the team can see how to improve the system by moving to CORBA. A year later the team replaces CORBA with a message queue. At every stage of this process the system is running. Every stage of the process provides the experience to get to the next stage." This really emphisizes the importance of being able to elegantly transition your system between implementations.
#### c. Initially we had separate add forms for every different type of event, even though the structure is the same. We are now using a genericAddForm for creating events. This form takes in all parameters eg. What to do on save, What fields (including type). This makes it a simpler design as it maintains consistency and ensures reusing of code.
### d. Refine or define the interfaces among the software system elements and with external entities.
#### a. 'g'
#### b. 
#### c. 
### e. Establish the design artifacts.
#### a. 'f'
#### b. XP states: "Maintain only the code and the tests as permanent artifacts." This is because the only artifact that will always be up to date is the code.
#### c. We do not have any design documents and the only artifacts we develop are our code and tests.

## 3. Assess Alternatives for Obtaining Software System Elements.
### a. Determine technologies required for each element composing the software system.
#### a. 'g'
#### b. XP states: "Simplicity is the most intensely intellectual of the XP values. To make a system simple enough to gracefully solve only today’s problem is hard work. Yesterday’s simple solution may be fine today, or it may look simplistic or complex." You must make a judgement call when it comes to determining technologies used in the system.
#### c. We try to use the simplist solutions possible, for example, using Expo GO is quite simple, but probably not the best solution.
### b. Identify candidate alternatives for the software system elements.
#### a. 'e'
#### b. XP talks about design alternatives: "They would sit for hours, talking about each of their ideas in turn. By the time they were tired of talking, they could have implemented all the alternatives twice." It talks about the importance of alternatives but emphasizes to not spend too much time on them.
#### c. We currently use EXPO GO that does not support OAuth Authentication - not allowing us to test link Google Calendar on the phone. While we looked for alternatives, we gave a hard deadline of 2 days and nobody could find anything better. So for the time being we have stuck on with Expo GO.
### c. Assess each candidate alternative against criteria developed from expected design characteristics and element requirements to determine sustainability for the intended application.
#### a. 'e'
#### b. XP states: "Put improvement to work by not waiting for perfection. Find a starting place, get started, and improve from there" This ensures that even if a solution isn't perfect, it can be improved over time.
#### c. We are currently using MYSQL which is a more lightweight database that will not be able to scale how we need it to. We will be able to adapt this in the future to meet our needs.
### d. Choose the preferred alternatives among candidate design solutions for the software system elements.
#### a. 'e'
#### b. This also relates to the quote from b. "They would sit for hours, talking about each of their ideas in turn. By the time they were tired of talking, they could have implemented all the alternatives twice." You must make decisions based on many factors including time cost.
#### c. We chose to use Expo GO due to less time cost and ease of access.

## 4. Manage the Design.
### a. Capture the design and rationale.
#### a. 'a'
#### b. XP says: "Everyone who touches software development has a sense of what matters. One person might think what really matters is carefully thinking through all conceivable design decisions before implementing. Another might think what really matters is not having any restrictions on his own personal freedom."
#### c. We first create a prototype design on figma - which is then shown to the client. The client gives feedback and if it meets the standards - approves it. We then begin implementing the given feature.
### b. Establish traceability between the detailed design elements, the system/software requirements, and the architectural entities of the software system architecture.
#### a. 'h'
#### b. XP says: "Traceability, the ability to link what has changed in a system to why it changed, is built into XP, although the information isn’t routinely recorded." Traceability is baked into XP through stories.
#### c. We keep track of all stories, time spent on them, and the commits related to them allowing for quite transparent traceability.
### c. Determine the status of the software system and element design.
#### a. 'h'
#### b. XP says: "The state of a shared plan provides clues about the state of the relationship between the people affected by the plan." This ensures the status of the system is known by all members.
#### c. We have a shared plan in the form of GitHub stories and open communication to ensure all members are up to date on the status of the system.
### d. Provide key artifacts and information items that have been selected for baselines.
#### a. 'f'
#### b. XP states: "System goes sour—XP creates and maintains a comprehensive suite of automated tests, which are run and rerun after every change (many times a day) to ensure a quality baseline. XP always keeps the system in deployable condition. Problems are not allowed to accumulate." This ensures the system is always in a useable state.
#### c. After every push, we have GitHub CI run multiple tests to ensure the quality of the code pushed.