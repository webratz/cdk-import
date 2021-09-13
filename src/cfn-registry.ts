import * as AWS from 'aws-sdk';
import { createAwsClient } from './aws';
import { TypeInfo } from './type-info';

/**
 * Calls the CFN resource type registry to fetch the type definition
 *
 * @param name the name or unique prefix of the resource type
 * @param _version the version of the type to resolve (NOT YET IMPLEMENTED)
 * @returns the type definition
 */
export async function describeResourceType(name: string, _version?: string): Promise<TypeInfo> {
  const cfn = createAwsClient(AWS.CloudFormation);

  let typeArn;

  if (name.startsWith('arn:')) {
    typeArn = name;
  } else {
    const types = [];
    let token;
    do {
      const res: AWS.CloudFormation.ListTypesOutput = await cfn.listTypes({
        NextToken: token,
        Type: name.endsWith('MODULE') ? 'MODULE' : 'RESOURCE',
        Filters: {
          Category: 'THIRD_PARTY',
          TypeNamePrefix: name,
        },
        Visibility: 'PUBLIC',
      }).promise();
      if (res.TypeSummaries) {
        types.push(...res.TypeSummaries);
      }
      token = res.NextToken;
    } while (token);

    if (types.length !== 1) {
      throw new Error('Cannot find unique CloudFormation Type ' + name);
    }

    typeArn = types[0].TypeArn;
  }

  const type = await cfn.describeType({
    Arn: typeArn,
    // TODO versioning
  }).promise();
  if (!type.Schema) {
    throw new Error('CloudFormation Type ' + name + ' does not contain schema');
  }
  if (!type.TypeName) {
    throw new Error('CloudFormation Type ' + name + ' does not contain a type name');
  }
  return {
    TypeName: type.TypeName,
    Schema: type.Schema,
    SourceUrl: type.SourceUrl ?? type.Arn!,
  };
}