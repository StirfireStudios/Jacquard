
export function getTextFrom(lines, startLine, endLine) {
  const outData = [];
  for(var index = startLine; index <= endLine; index++) outData.push(lines[index]);
  return outData.join("\n");
}

export function ParseNodeData(node, fileData, sectionName) {
  let section = sectionName;
  let title = node.name;
  if (node.attributes.section != null) {
    section = node.attributes.section;    
  }

  if (title.startsWith(section)) title = title.substr(section.length + 1);

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
    const startLine = node.bodyLocation.start.line - 1;
    const endLine = node.bodyLocation.end.line - 1;
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
