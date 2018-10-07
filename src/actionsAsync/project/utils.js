
export function getTextFrom(lines, startLine, endLine) {
  const outData = [];
  for(var index = startLine; index <= endLine; index++) outData.push(lines[index]);
  return outData.join("\n");
}

export function ParseNodeData(node, fileData) {
  let section = "default";
  let title = node.name;
  if (node.attributes.sections != null) {
    section = node.attributes.sections;
    title = title.substr(section.length+"-");
  }

  const attributes = Object.assign({}, node.attributes);
  delete(attributes.section);

  const nodeData = {
    title: title,
    section: section,          
    attributes: node.attributes,
    dirty: false,
    parsedData: node,
  };

  let body = "";

  if (node.statements.length > 0) {
    const fileLines = fileData.split(/\r\n|\n/);
    const startLine = node.statements[0].location.start.line - 1;
    const endLine = node.statements[node.statements.length - 1].location.end.line - 1;
    body = getTextFrom(fileLines, startLine, endLine);
  }

  return {
    title: title,
    section: section,
    attributes: attributes,
    dirty: false,
    parsedData: node,
    body: body,
    tags: node.tags,
  }
}
