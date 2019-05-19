export class Project {
  id: number;
  name: string;
  type: string;
  description: string;
  sourceUrl: string;
  url: string;
  image: string;
  orderBy: number;

  static clone(other: Project): Project {
    let project = new Project();

    project.id = other.id;
    project.name = other.name;
    project.type = other.type;
    project.description = other.description;
    project.sourceUrl = other.sourceUrl;
    project.url = other.url;
    project.image = other.image;
    project.orderBy = other.orderBy;

    return project;
  }
}
