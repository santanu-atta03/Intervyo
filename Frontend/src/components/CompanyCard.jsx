const CompanyCard = ({ company }) => {
  return (
    <Card sx={{ ':hover': { transform: 'scale(1.05)' }, outline: '2px solid #007bff' }}>
      <CardContent>
        <Typography variant='h6'>{company.name}</Typography>
        <Typography>{company.description}</Typography>
      </CardContent>
    </Card>
  );
};
const CompanyCard = ({ company }) => {
  return (
    <Card sx={{ ':hover': { transform: 'scale(1.05)' }, outline: '2px solid #007bff' }}>
      <CardContent>
        <Typography variant='h6'>{company.name}</Typography>
        <Typography>{company.description}</Typography>
      </CardContent>
    </Card>
  );
};

