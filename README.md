# starlight-dbt

Beautiful, customisable, high-performance dbt docs using Starlight (Astro)

# Roadmap to 0.1.0

- [x] Translate dbt-docs build code into modern modular typescript.
- [x] work out how to do changelog / cicd npm deploy
- [x] Structure out basic plugin structure, and get basic code working so that models generate pages in dev/build (use vite virtual modules?)
- [x] Add project/database/group to sidebar as dymanic custom component.
  - [x] Add persistance between page changes (radio option doesn't change)
  - [x] Make similar pages stick between radio option changes
  - [ ] Make it work over different dbt projects
  - [ ] update Icons
  - [ ] Test all the above
- [ ] Refactor to use content layer
  - [ ] Move file loading to manager, and away from the json parsing
- [ ] Add multiple dbt projects / packages?
- [ ] Improve internal typing
  - [ ] zod
  - [ ] redefine a lot of the manifest/catalog schema types explicitly
  - [ ] make catalog optional
  - [ ] get the typing on the virtual model to work (i.e. `virtual:dbt-data`)
- [ ] Make `DbtPageTemplate.astro` work well.
- [ ] improve test coverage on lib (unit testing)
- [ ] sort out cicd (formatting, linting, testing)
- [ ] sort out older versions of dbt manifest
- [ ] Add option to markdown config for it to be before or after dbt component.
- [ ] S3 content population
- [ ] Versioning (sidebar vs entire page)?
- [ ] Search
- [ ] Graph
- [ ] Theme
- [ ] Docs and examples
