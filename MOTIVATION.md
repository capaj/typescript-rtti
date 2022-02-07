# Runtime Type Information for Typescript

> _A discussion of the the motivations behind `reflect()` and the `typescript-rtti` project_

Author: William Lahti <wilahti@gmail.com> (@rezonant)

# Introduction

With the advent of Typescript transformers there have been some attempts in the community to push forward on runtime type information support in Typescript but few have reached a level suitable for use in the broader community. The few that do have not rose to the defacto standard needed to form consensus. 

Numerous popular libraries and frameworks make use of the existing but limited runtime type metadata system supported by Typescript for use cases like serialization, validation, ORM, dependency injection, declarative web services, testing, and even aspect-oriented programming. With this functionality directly tied to decorators these libraries are forced to incorporate them into their API designs, typically in a way that cleverly hides the deficiencies of Typescript's underlying runtime type information mechanism, `emitDecoratorMetadata`. Personally I'm a huge fan of decorators, and I wait with bated breath for Ecmascript decorators to reach Stage 3, but it is simply not logical that runtime type information is predicated upon usage of this feature. It seems there's a sizable appetite for this amongst the community as well. 

There is also an opportunity to fix the mistakes of the `emitDecoratorMetadata` format.
- Using reference indirection to solve the declaration ordering / circular reference problem
- Making the format more extensible
- More efficient
- More comprehensive

# The Mechanism

Typescript's "custom transformers" feature should enable an external project to solve runtime type information without 
requiring Typescript itself to advance it. There have been a number of attempts at solving this problem via transformers, but unfortunately few attempted solutions succeed in solving the problem comprehensively.

# Performance

Typescript only emits metadata for syntactic elements which have at least one decorator applied. Ostensibly the rationale for this is to limit the runtime impact of type metadata, but I assert that the runtime impact of loading type information at runtime is limited to startup time and memory consumption, and these metrics are not as important as "warm" performance, where the application is entirely loaded and bootstrapped.

When emitting potentially thousands of runtime type metadata items, it is clear there will be performance impact at startup. However, once the code is executed, what is left is a memory footprint, and the cost of accessing the data on demand. This leaves the vast majority of the application to perform as it would without any runtime type metadata available. 

Still, solution to the RTTI problem should not unduly burden the runtime performance of a Typescript application which decides to incorporate it. A good solution will carefully optimize for
- **Startup performance**  
  Should not incur more cost in terms of startup time than absolutely necessary
- **Storage overhead**  
  Should record metadata in a concise, efficient and packed manner
- **"Access" overhead**  
  Should minimize the runtime impact of accessing metadata as execution of the program goes on.

# A "Non Goal" for Typescript

Typescript itself indirectly says that enabling these capabilities is a non-goal:

> Non-goal #5: Add or rely on run-time type information in programs, or emit different code based on the results of the type system. Instead, encourage programming patterns that do not require run-time metadata.  
> -- [_Typescript Design Goals_](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Design-Goals#non-goals)

Unfortunately, the genie is out of the bottle-- the Typescript community is using and embracing runtime type metadata, and it isn't up to the Typescript developers to limit how the technology is used. While it may be out of scope for Typescript itself to provide these capabilities, that doesn't magically eliminate the desire to use these techniques to solve problems in ways that retain the features of Typescript that made it so popular: Static type analysis, automated
refactoring, integrated Intellisense including documentation.

# Typescript isn't Wrong 

It is probably best that development of runtime metadata live outside of the Typescript project itself for now. As of this writing, Typescript is the most popular superset of Ecmascript available-- it seems almost inevitable that Typescript will become the defacto standard way to write Ecmascript. As Typescript becomes more popular, the Ecmascript community risks being sucked into it's gravity. If more and more frameworks on NPM depend on Typescript-emitted metadata, that will reduce the viability of writing code in pure Ecmascript, and it is understandable that the Typescript team doesn't want to push towards this sort of outcome. 

A popular Ecmascript-derived language like Typescript, which has already been fairly influential to Ecmascript itself, has a responsibility to be a good citizen of the overall Ecmascript community. Even as Typescript usage goes through the roof, it is not in their best interest to evolve itself in ways that become incompatible with the language of which it is a super set. Creating an ecosystem "short circuit" where the community self-enforces its own use of Typescript is dysfunctional. This is one reason why Typescript does not recommend publishing NPM packages comprised of actual Typescript code (instead the transpiled result of a Typescript project should be published). Similarly Typescript has provided a way to define and consume compile-time type metadata ("typings") that does not require upstream projects themselves to incorporate it in order for Typescript users to benefit, and a large-scale community project for collecting typings under one umbrella to ensure high quality and ongoing maintenance (DefinitelyTyped).

Despite all of this, we ourselves as Typescript users see the benefit to integrating type reflection to provide the sorts of developer experiences made easy on statically-typed runtimes like the Java Runtime Environment and the Common Language Runtime, and there is plenty of space in the community for solutions that do and do not make use of runtime type information. Being cognizant of the ecosystem impact however is vital to designing a solution that promotes cooperation and code sharing between Ecmascript and Typescript projects and their end-developers.

# Decorators

It is entirely reasonable for the Typescript team to avoid digging into a topic that is currently in standards flux, and which they may have stepped prematurely by offering to their audience in the first place.

Runtime type metadata was originally added to Typescript alongside decorators, this is why you use `emitDecoratorMetadata` to enable emission of runtime metadata even when you aren't particularly interested in decorating anything. Due to this, the design of declarative libraries have been driven toward decorators, even when they are not needed. You see this in all of the popular modern usages of runtime type information in Typescript: If RTTI is needed, a decorator will be present. The most poignant example of this is `@Injectable()` found in Angular and frameworks which share it's ancestry. A class is only available for dependency injection if `@Injectable()` is present on it. In modern versions of Angular this is enforced (despite having any technical requirement to do so), but in older versions it is there only to cause Typescript to emit runtime type information for the class's constructor function. You can apply any other decorator and Angular's dependency injection system will be able to work with it.

Frameworks like TypeORM require you to add `@Column` to every property even when `@Entity` is added to the containing class. It should be possible for the framework to treat any property on a class decorated with `@Entity` as a database column, but since Typescript emits no metadata for undecorated properties, TypeORM doesn't offer a way to assume that properties are database columns. 

Frameworks which have reliable runtime type information to depend on can be designed differently, enabling new declarative functionality with less ceremony. There are plenty of vocal users of Typescript who are interested in making use of runtime type information who are fatigued at the prominence of decorators within these solutions. 

# Long Term Impacts

Creating and maintaining a community solution has some long term impacts to the entire ecosystem: there will be package versions published which ship a particular metadata format, and should it become popular, it may create difficulties for long term compatibility. Whatever community solution provides runtime type metadata should be cognizant of backwards compatibility, not just for its own semantic versioning _but support for previous formats in perpetuity_. This is a difficult challenge that is exacerbated when end user code directly accesses the emitted metadata.

# Solution: Metadata via API

We want to solve the problems we've elaborated above:
- Provide runtime type metadata to solve existing and future declarative framework usecases
- Keep emitted type metadata compact and limit performance impacts while remaining easy to access
- Let Typescript itself focus on its goals and avoid focusing on its non-goals
- Avoid creating a toxic absorption effect where Ecmascript is absorbed into Typescript 
- Avoid long term impacts of publishing metadata which will need to be carried into the future

One critical design decision crosscuts these concerns: **Coupling the API itself to the emission of the metadata.**

What I mean here is that the solution should actively discourage (even prevent, where possible) its users from directly accessing the emitted metadata, and instead provide an API which will be responsible for handling previous versions of the metadata format. Such an API should support the `emitDecoratorMetadata` format and even support formats used by competing solutions as it becomes necessary.

This allows us to solve use cases today without requiring colossal movement on the part of the Typescript projects and the TC39 committee. This project is independent, and its usage by the community can serve as an important signal to standardization efforts of the importance of a variety of use cases, but neither Typescript nor Ecmascript have any obligation to impede their efforts based on the capabilities this project ships. Should a new metadata standard arise, we should be able to add support for it in the API as "yet another metadata format". As the standards, formats, and types of emitted metadata evolve, we can continue to provide a versioned API which encapsulates these complexities, providing a simple and consistent interface and developer experience.

Because the metadata is designed to be consumed via the standardized API, we can afford to optimize it in ways that make storage and loading more efficient at the expense of human readability. As we learn more about how best to ship metadata at runtime, we can evolve emission to take advantage while supporting older libraries using the older emission scheme. 

Typescript (which has perhaps mis-stepped in the past by committing to decorators before they had been shaken out of the standards process) can abstain from creating a larger imposition into the existing Ecmascript ecosystem while still providing the tooling experiences that developers love.

Furthermore, with a standard Ecmascript-friendly API, we can enable non-Typescript developers to consume type metadata where it makes sense, and for non-Typescript projects to enable emission of compatible metadata for other languages and even Ecmascript itself. Ironically this may end up being enabled (in part) via the [Decorators Proposal](https://github.com/tc39/proposal-decorators) which despite lingering for many years in early stages of the Ecmascript process, now appears to be approaching Stage 3. 

